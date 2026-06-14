// 📋 Reviews service — queries the DB directly (no self-fetch). ⚠️ Never fetch() your own API
//    from a Server Component on serverless: during cold start the server isn't up → ECONNREFUSED.

import { connectDB } from '@/lib/db/connection';
import { Doctor } from '@/lib/db/models/doctor';
import { User } from '@/lib/db/models/user';

export type ReviewItem = {
  _id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  doctorName: string;
  doctorLink: string;
  date: string; // raw ISO string — formatted client-side to avoid hydration mismatch
};

type RawReview = {
  _id: unknown;
  userId?: unknown;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  status: string;
  createdAt?: Date;
};

type RawDoctor = {
  _id: unknown;
  name: string;
  reviews: RawReview[];
};

export async function getApprovedReviews(limit = 12): Promise<ReviewItem[]> {
  await connectDB();

  const doctors = await Doctor.find({ 'reviews.status': 'approved' })
    .select('name _id reviews')
    .lean<RawDoctor[]>();

  const approvedReviews = doctors.flatMap((doc) =>
    doc.reviews.filter((r) => r.status === 'approved'),
  );

  // Collect unique userIds to fetch live avatars in one query
  const userIds = [
    ...new Set(
      approvedReviews.map((r) => String(r.userId ?? '')).filter(Boolean),
    ),
  ];

  const users = userIds.length
    ? await User.find({ _id: { $in: userIds } })
        .select('_id avatar')
        .lean<{ _id: unknown; avatar?: string }[]>()
    : [];

  const avatarMap = new Map(users.map((u) => [String(u._id), u.avatar || '']));

  const reviews: ReviewItem[] = approvedReviews.map((r) => {
    const userId = String(r.userId ?? '');
    const liveAvatar = avatarMap.get(userId);
    // Priority: live User avatar > avatar stored on review document
    const userAvatar =
      liveAvatar !== undefined && liveAvatar !== ''
        ? liveAvatar
        : r.userAvatar || '';

    const doctorDoc = doctors.find((d) =>
      d.reviews.some((dr) => String(dr._id) === String(r._id)),
    );

    return {
      _id: String(r._id),
      userName: r.userName || 'کاربر ناشناس',
      userAvatar,
      rating: r.rating,
      comment: r.comment,
      doctorName: doctorDoc?.name ?? '',
      doctorLink: doctorDoc ? `/doctors/${String(doctorDoc._id)}` : '#',
      // 🔒 Raw ISO string — toLocaleDateString('fa-IR') differs between Node (no full-ICU) and the
      //    browser → hydration mismatch. UserTestimonialsCarousel formats this client-side.
      date: r.createdAt ? new Date(r.createdAt).toISOString() : '',
    };
  });

  // Sort newest first
  reviews.sort((a, b) => b.date.localeCompare(a.date));

  return reviews.slice(0, limit);
}
