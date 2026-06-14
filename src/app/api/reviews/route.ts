// GET /api/reviews — latest approved reviews across all doctors for homepage carousel
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Doctor } from '@/lib/db/models/doctor';
import { User } from '@/lib/db/models/user';

// Per-request — reviews reflect live user avatars
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const doctors = await Doctor.find({ 'reviews.status': 'approved' })
      .select('name _id reviews')
      .lean<{
        _id: unknown;
        name: string;
        reviews: Array<{
          _id: unknown;
          userId?: unknown;
          userName: string;
          userAvatar?: string;
          rating: number;
          comment: string;
          status: string;
          createdAt?: Date;
        }>;
      }[]>();

    // Collect all userIds from approved reviews
    const approvedReviews = doctors.flatMap(doc =>
      doc.reviews.filter(r => r.status === 'approved')
    );
    const userIds = [...new Set(
      approvedReviews.map(r => String(r.userId ?? '')).filter(Boolean)
    )];

    // Fetch live avatars from User collection in one query
    const users = userIds.length
      ? await User.find({ _id: { $in: userIds } })
          .select('_id avatar')
          .lean<{ _id: unknown; avatar?: string }[]>()
      : [];
    const avatarMap = new Map(users.map(u => [String(u._id), u.avatar || '']));

    const reviews = approvedReviews.map(r => {
      const userId      = String(r.userId ?? '');
      const liveAvatar  = avatarMap.get(userId);
      // Priority: live User avatar > avatar stored on review document
      const userAvatar  = (liveAvatar !== undefined && liveAvatar !== '')
        ? liveAvatar
        : (r.userAvatar || '');

      return {
        _id:        String(r._id),
        userName:   r.userName || 'کاربر ناشناس',
        userAvatar,
        rating:     r.rating,
        comment:    r.comment,
        doctorName: doctors.find(d => d.reviews.some(dr => String(dr._id) === String(r._id)))?.name ?? '',
        doctorId:   String(doctors.find(d => d.reviews.some(dr => String(dr._id) === String(r._id)))?._id ?? '#'),
        createdAt:  r.createdAt ? new Date(r.createdAt).toISOString() : '',
      };
    });

    // Sort newest first, return up to 12
    reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({ data: reviews.slice(0, 12) });
  } catch {
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
