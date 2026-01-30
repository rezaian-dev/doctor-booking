// 🎯 Types
export type ProfileMode = 'payment' | 'confirm' | 'default' | 'find-doctor' | 'profile';
export interface DoctorData {
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewsCount: number;
  medicalCode: string;
  address: string;
  nextAvailableSlot: string;
  bio: string;
}
