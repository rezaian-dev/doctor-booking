import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { NewsletterSubscriber } from "@/lib/db/models/newsletter-subscriber";
import { newsletterSchema } from "@/lib/validations/newsletter";

// 📧 POST /api/newsletter — subscribe an email to the newsletter
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "آدرس ایمیل نامعتبر است" },
        { status: 400 }
      );
    }

    await connectDB();

    const { email } = parsed.data;

    const existing = await NewsletterSubscriber.findOne({ email }).lean();

    if (existing) {
      // ⚠️ Duplicate — explicit code so the client can show a warning toast
      return NextResponse.json(
        {
          success: true,
          code: "ALREADY_SUBSCRIBED",
          message: "این ایمیل قبلاً ثبت شده است",
        },
        { status: 200 }
      );
    }

    await NewsletterSubscriber.create({ email });

    // ✅ Brand-new subscription
    return NextResponse.json(
      {
        success: true,
        code: "SUBSCRIBED",
        message: "ایمیل شما با موفقیت ثبت شد",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
