// 📤 Admin-only image upload → saves to public/uploads/<folder>, returns its public URL.
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
// 🔒 Whitelisted destination folders — blocks path traversal via the `folder` field
const FOLDERS = new Set(["doctors", "articles", "uploads"]);

/* 📁 POST — validate + save an uploaded image, return its public URL */
export async function POST(req: NextRequest) {
  // 🛡️ Admin only — /api/admin/* is NOT covered by proxy.ts
  const denied = await requireApiAdmin();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderRaw = (formData.get("folder") as string) || "uploads";
    // 🚫 Reject anything outside the whitelist (no "..", no slashes can escape)
    const folder = FOLDERS.has(folderRaw) ? folderRaw : "uploads";

    if (!file || file.size === 0)
      return NextResponse.json({ error: "فایل یافت نشد" }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "حجم فایل بیش از ۵MB است" }, { status: 400 });
    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ error: "فقط JPEG, PNG, WebP مجاز است" }, { status: 400 });

    // 🔑 Random filename — never trust the client-supplied name on disk
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${nanoid()}.${ext || "jpg"}`;
    const uploadDir = join(process.cwd(), "public", "uploads", folder);

    await mkdir(uploadDir, { recursive: true }); // 📂 ensure dir exists
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer); // 💾 write to disk

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "آپلود ناموفق بود" }, { status: 500 });
  }
}
