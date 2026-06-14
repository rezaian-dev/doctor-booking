import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, describeConnectionError } from "@/lib/db/connection";

// 🩺 Runtime DB diagnostics — open /api/health/db on the deployed site to see the exact
//    reason the DB connection fails (booleans + host only, no secrets). ⚠️ Delete once it works.
export const dynamic = "force-dynamic"; // 🔁 never cache — always run live
export const runtime = "nodejs"; // 🟢 Mongoose needs the Node.js runtime

export async function GET() {
  const uri = process.env.MONGODB_URI;

  // 🔐 Presence of each var (booleans only — values are never exposed)
  const env = {
    MONGODB_URI: Boolean(uri),
    ACCESS_TOKEN_SECRET: Boolean(process.env.ACCESS_TOKEN_SECRET),
    REFRESH_TOKEN_SECRET: Boolean(process.env.REFRESH_TOKEN_SECRET),
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? null,
    NODE_ENV: process.env.NODE_ENV ?? null,
  };

  // 🚦 Case 1 — the Functions runtime can't even SEE the URI (scope/redeploy issue)
  if (!uri) {
    return NextResponse.json(
      {
        ok: false,
        stage: "env",
        hint: "MONGODB_URI is NOT visible to the runtime. In Vercel → Project → Settings → Environment Variables, add it for the Production (and Preview) environment, then trigger a NEW deploy.",
        env,
      },
      { status: 500 },
    );
  }

  // 🔎 Show scheme/host/db ONLY (never user:password) → confirm Atlas vs localhost
  let target: { scheme?: string; host?: string; db?: string } = {};
  try {
    const u = new URL(uri);
    target = {
      scheme: u.protocol.replace(":", ""),
      host: u.host,
      db: u.pathname.replace(/^\//, "") || "(MISSING db name in URI!)",
    };
  } catch {
    target = { host: "(unparseable MONGODB_URI)" };
  }

  // 🧪 Case 2 — attempt the real connection the app uses
  try {
    await connectDB();
    const doctors =
      (await mongoose.connection.db?.collection("doctors").countDocuments()) ?? null;
    return NextResponse.json({ ok: true, stage: "connected", target, doctors, env });
  } catch (err) {
    const e = err as { name?: string; message?: string };
    const isLocal =
      target.host?.includes("localhost") || target.host?.includes("127.0.0.1");
    return NextResponse.json(
      {
        ok: false,
        stage: "connect",
        // 🏷️ Single source of truth — same classified cause printed in server logs.
        cause: describeConnectionError(err),
        readyState: mongoose.connection.readyState, // 0=disconnected 1=connected 2=connecting 3=disconnecting
        error: { name: e.name ?? "Error", message: e.message ?? String(err) },
        hint: isLocal
          ? "URI points to localhost — Vercel's serverless functions cannot reach it. Use a MongoDB Atlas URI."
          : "Connection failed. Check: (1) Atlas → Network Access allows 0.0.0.0/0, (2) password is URL-encoded, (3) db user & password are correct, (4) the URI ends with /doctor-booking.",
        target,
        env,
      },
      { status: 500 },
    );
  }
}
