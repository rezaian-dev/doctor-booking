// 🎯 Profile view modes (controls UI state & routing)
export type ProfileMode = 'payment' | 'confirm' | 'default' | 'find-doctor' | 'profile';

// 👨‍⚕️ Doctor public profile data (read-only, API-sourced)
export interface DoctorData {
  name: string;                // 👤 Full name (e.g., "دکتر علی رضایی")
  specialty: string;           // 🩺 Primary specialty (e.g., "روانپزشکی")
  image: string;               // 🖼️ Avatar URL (CDN-hosted)
  rating: number;              // ⭐ Avg. rating (0.0–5.0)
  reviewsCount: number;        // 💬 Total verified reviews
  medicalCode: string;         // 🪪 Official license number
  address: string;             // 📍 Clinic/hospital location
  nextAvailableSlot: string;   // 📅 Earliest appointment (Jalali date + time, e.g., "1405-03-10 14:30")
  bio: string;                 // 📝 Professional background summary
}
