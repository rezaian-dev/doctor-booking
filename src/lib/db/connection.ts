import mongoose from "mongoose";

declare global {
  // 🌐 Cache across warm serverless invocations → never reconnect per request.
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

// 🔒 Predictable query filtering across the app.
mongoose.set("strictQuery", true);

// 🩹 Bind connection listeners once: a stray 'error' with no listener becomes an unhandled
//    rejection that can kill the serverless function (an opaque 504 instead of the real cause).
let listenersBound = false;
function bindConnectionListeners() {
  if (listenersBound) return;
  listenersBound = true;

  mongoose.connection.on("error", (err) => {
    console.error("[DB] connection error →", describeConnectionError(err));
  });

  mongoose.connection.on("disconnected", () => {
    // 🧹 Invalidate cache so the next call forces a fresh connect.
    cached.conn = null;
    cached.promise = null;
  });
}

// 🏷️ Translate a raw driver error into a precise, actionable cause.
//    This is what makes /api/health/db and server logs immediately useful.
export function describeConnectionError(err: unknown): string {
  const e = err as { name?: string; code?: number | string; message?: string };
  const msg = e?.message ?? String(err);

  // 🔐 Wrong or rotated credentials (stale password on Vercel is the classic case)
  if (e?.code === 18 || e?.code === 8000 || /bad auth|authentication failed/i.test(msg)) {
    return "AUTH_FAILED — db user/password wrong, or password was rotated but Vercel env still holds the old one. URL-encode the password and update the Production env.";
  }
  // 🌍 SRV / DNS cannot resolve the cluster host
  if (/querySrv|ENOTFOUND|getaddrinfo|EAI_AGAIN/i.test(msg)) {
    return "DNS_SRV — cluster host in the URI is unresolvable. Re-copy the SRV string from Atlas → Connect.";
  }
  // 🚧 Reached Atlas but nothing accepted us in time → almost always IP whitelist
  if (e?.name === "MongooseServerSelectionError" || /server selection|timed out/i.test(msg)) {
    return "SERVER_SELECTION — reached Atlas but no server replied in time. Top cause: Network Access lacks 0.0.0.0/0, so Vercel's dynamic IPs are blocked.";
  }
  return `UNKNOWN — ${msg}`;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      // 🛟 Actionable diagnostic — #1 local cause is a missing .env.local at root.
      "Missing MONGODB_URI environment variable. " +
        "Locally: copy `.env.example` → `.env.local`, set MONGODB_URI to your Atlas SRV string, " +
        "then RESTART the dev server (env is not hot-reloaded). " +
        "On Vercel: add it under Settings → Environment Variables for Production, then trigger a NEW deploy.",
    );
  }

  // ✅ Reuse a healthy, live connection.
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 🧹 Drop a dead / half-open connection (0 = disconnected, 3 = disconnecting).
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  bindConnectionListeners();

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      // 🚫 Fail fast instead of silently queueing ops when offline.
      bufferCommands: false,

      // ⏱️ Keep BELOW the serverless function budget (~10s) so the REAL classified
      //    error returns instead of the platform killing the request with a 504.
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,

      // 🪶 Serverless pools are short-lived — never pin idle sockets open.
      maxPoolSize: 5,
      minPoolSize: 0,
      heartbeatFrequencyMS: 10000,

      // 🌐 Force IPv4. IPv6 SRV resolution can hang on Vercel cold starts and is
      //    the silent reason many Atlas connections "work locally, fail on Vercel".
      family: 4,

      retryWrites: true,

      // 🏗️ Never build indexes on a production cold start (slow + serializes requests).
      autoIndex: process.env.NODE_ENV !== "production",
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // 🔁 let the next request retry from scratch
    // 🔊 Surface the REAL, classified reason in logs — never a silent failure.
    console.error("[DB] MongoDB connection failed →", describeConnectionError(error));
    throw error;
  }

  return cached.conn;
}
