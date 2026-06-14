import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";

const DIR = join(process.cwd(), "public", "uploads", "articles");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

async function ensureDir() {
  if (!existsSync(DIR)) await mkdir(DIR, { recursive: true });
}

// POST /api/articles/cover — saves the cover image, returns its public URL
export async function POST(req: NextRequest) {
  // 🛡️ Admin only — cover/content image upload is an admin-panel operation
  const denied = await requireApiAdmin();
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get("cover") as File | null;

    if (!file || file.size === 0)
      return NextResponse.json({ error: "فایلی ارسال نشد" }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "حجم فایل بیش از ۵MB است" }, { status: 400 });
    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ error: "فقط JPEG, PNG, WebP مجاز است" }, { status: 400 });

    await ensureDir();

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/articles/${filename}` });
  } catch {
    return NextResponse.json({ error: "آپلود ناموفق" }, { status: 500 });
  }
}
