// ⭐ Admin review moderation query — extracted from (dashboard)/admin/reviews/page.tsx
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";

export type ReviewItem = {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
};

export type DoctorWithReviews = {
  _id: string;
  name: string;
  specialty: string;
  photo: string;
  reviews: ReviewItem[];
  pendingCount: number;
};

export async function getDoctorsWithReviews(): Promise<DoctorWithReviews[]> {
  await connectDB();

  const raw = await Doctor.find({ "reviews.0": { $exists: true } })
    .select("name specialty photo reviews")
    .lean<{
      _id: unknown;
      name: string;
      specialty: string;
      photo: string;
      reviews: {
        _id: unknown;
        userId: unknown;
        userName: string;
        userAvatar: string;
        rating: number;
        comment: string;
        status: string;
        createdAt: Date;
      }[];
    }[]>();

  return raw
    .map((d) => {
      const reviews: ReviewItem[] = [...(d.reviews ?? [])]
        .sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return  1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .map((r) => ({
          _id:        String(r._id),
          userId:     String(r.userId ?? ""),
          userName:   r.userName,
          userAvatar: r.userAvatar ?? "",
          rating:     r.rating,
          comment:    r.comment,
          status:     r.status,
          createdAt:  new Date(r.createdAt).toLocaleDateString("fa-IR"),
        }));

      return {
        _id:          String(d._id),
        name:         d.name,
        specialty:    d.specialty,
        photo:        d.photo ?? "",
        reviews,
        pendingCount: reviews.filter((r) => r.status === "pending").length,
      };
    })
    .sort((a, b) => b.pendingCount - a.pendingCount);
}
