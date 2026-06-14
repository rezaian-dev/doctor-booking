// 🖥️ Determines which view/mode the profile page renders
export type ProfileMode =
  | "default"
  | "confirm"
  | "search"
  | "payment"
  | "profile"
  | "appointment";

export interface DoctorData {
  // 🏥 Core doctor info
  name:         string;
  specialty:    string;
  image:        string;
  rating:       number;
  reviewsCount: number;
  medicalCode:  string;
  address:      string;
  bio:          string;

  // 🗓️ Scheduling
  nextAvailableSlot?: string;
  doctorId?:          string;
  visitFee?:          number;

  // 💳 Payment page extras
  visitType?:    string;
  patientName?:  string;
  patientPhone?: string;
  bookedForSelf?: boolean; // 🧑‍⚕️ false → appointment was booked for another person

  // 🎫 Appointment card
  appointmentStatus?: "active" | "expired" | "cancelled";
  appointmentId?:     string;
  trackingCode?:      string;
}
