import { NextRequest, NextResponse } from "next/server";
import { connectDB }        from "@/lib/db/connection";
import { ContactMessage }   from "@/lib/db/models/contact-message";
import { contactSchema }    from "@/lib/validations/contact";

// 📬 POST /api/contact — save contact form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Zod validation — reuse same schema as client
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نادرست است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    // 🧠 Drop empty/undefined email — passing `undefined` breaks the create()
    //    overload under exactOptionalPropertyTypes.
    const { email, ...rest } = parsed.data;
    await ContactMessage.create({ ...rest, ...(email ? { email } : {}) });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
