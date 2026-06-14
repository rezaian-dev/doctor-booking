import { NextRequest, NextResponse } from 'next/server';
import type { QueryFilter } from 'mongoose';
import { connectDB } from '@/lib/db/connection';
import { Doctor } from '@/lib/db/models/doctor';
import type { IDoctor } from '@/lib/db/models/doctor';
import { User } from '@/lib/db/models/user';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { reviewSchema } from '@/lib/validations/review';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const doctor = await Doctor.findById(id).select('reviews');
  if (!doctor)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const approved = (doctor.reviews as Array<{ status: string }>).filter((r) => r.status === 'approved');
  return NextResponse.json({ data: approved });
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;

  // 🔐 Auth from cookie
  const token = req.cookies.get('accessToken')?.value;
  if (!token)
    return NextResponse.json({ error: 'برای ثبت نظر ابتدا وارد شوید' }, { status: 401 });

  const payload = await verifyAccessToken(token);
  if (!payload?.userId)
    return NextResponse.json({ error: 'توکن نامعتبر است' }, { status: 401 });

  // ✅ Validate body
  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'اطلاعات نامعتبر است' }, { status: 400 });

  await connectDB();

  // 👤 Resolve the reviewer's name from the DB
  const user = await User.findById(payload.userId)
    .select('firstName lastName')
    .lean() as { firstName: string; lastName: string } | null;

  if (!user)
    return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });

  const userName = `${user.firstName} ${user.lastName}`;

  // 🛡️ Race-safe insert: the $ne filter rejects the push when this user already reviewed this
  //    doctor, so a double-submit can never create two reviews. One per user. 🔒
  const guardFilter: QueryFilter<IDoctor> = {
    _id: id,
    'reviews.userId': { $ne: String(payload.userId) },
  };

  // 💾 Save the review (atomically gated)
  const doctor = await Doctor.findOneAndUpdate(
    guardFilter,
    {
      $push: {
        reviews: {
          ...parsed.data,
          userId: payload.userId,
          userName,
          status: 'pending',
        },
      },
    },
    { new: true, runValidators: true }
  );

  // 🩺 null → doctor missing OR user already reviewed; disambiguate to 409 vs 404
  if (!doctor) {
    const doctorExists = await Doctor.exists({ _id: id });
    return doctorExists
      ? NextResponse.json({ error: 'شما قبلاً برای این پزشک نظر ثبت کرده‌اید' }, { status: 409 })
      : NextResponse.json({ error: 'دکتر یافت نشد' }, { status: 404 });
  }

  return NextResponse.json(
    { message: 'نظر شما ثبت شد و پس از بررسی نمایش داده خواهد شد' },
    { status: 201 }
  );
}
