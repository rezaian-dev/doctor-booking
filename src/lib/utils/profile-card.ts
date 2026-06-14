import type { DoctorData } from "@/types/doctor";
import type { DoctorDetail } from "@/lib/services/doctors";

// 🖼️ Fallback shown when a doctor has no photo
export const NO_IMAGE = "/images/no-image.png";

// 🗂️ Fields every booking-flow ProfileCard pulls from a fetched doctor
type DoctorCore = Pick<
  DoctorDetail,
  | "name"
  | "specialty"
  | "photo"
  | "medicalCode"
  | "address"
  | "about"
  | "avgRating"
  | "reviewCount"
>;

// 🔁 Map a fetched doctor → ProfileCard `data` (DRY across doctor / confirm / payment).
//    `overrides` injects page-specific extras (slot, fee, patient…).
export function toProfileCardData(
  doctor: DoctorCore,
  overrides: Partial<DoctorData> = {},
): Partial<DoctorData> {
  return {
    name:         doctor.name,
    specialty:    doctor.specialty,
    image:        doctor.photo || NO_IMAGE,
    rating:       doctor.avgRating,
    reviewsCount: doctor.reviewCount,
    medicalCode:  doctor.medicalCode,
    address:      doctor.address,
    bio:          doctor.about,
    ...overrides,
  };
}
