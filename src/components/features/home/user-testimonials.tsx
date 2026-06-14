// ✅ Server Component — queries the DB directly (no self-fetch). The old fetch(`${BASE_URL}
//    /api/reviews`) caused ECONNREFUSED on serverless cold starts.
import { getApprovedReviews } from '@/lib/services/reviews';
import UserTestimonialsCarousel from './user-testimonials-carousel';

export default async function UserTestimonials() {
  // 🛡️ No fake/placeholder fallback. On DB error OR zero approved reviews we render
  //    NOTHING — showing seeded mock testimonials would misrepresent real user feedback.
  const items = await getApprovedReviews().catch(() => []);
  if (items.length === 0) return null; // 🙈 hide the whole section (no empty header)

  return <UserTestimonialsCarousel items={items} />;
}
