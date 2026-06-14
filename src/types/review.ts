// 👨‍⚕️ Minimal doctor data for review context
export interface DoctorData {
  name: string;       // 👤 Full name (e.g., "Dr. Maryam Ahmadi")
  specialty: string;  // 🩺 Medical specialty (e.g., "Dermatology")
  image: string;      // 🖼️ Profile picture URL
}

// ✍️ User-submitted review payload
export interface ReviewFormData {
  rating: number;                     // ⭐ 1–5 stars
  recommendation: 'recommend' | 'not-recommend'; // 👍/👎 Would you recommend?
  comment?: string | undefined;      // 💬 Optional detailed feedback (matches zod-inferred type) 🧠
}
