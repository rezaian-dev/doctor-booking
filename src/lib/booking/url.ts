// 🔗 Centralizes all booking URL construction — single source of truth

export interface BookingConfirmParams {
  doctorId:    string;
  date:        string; // "1404-12-13"
  time:        string; // "11:00"
  displayDate: string; // 📅 Persian label, e.g. "13 Esfand 1404"
  displayTime: string; // 🕐 Persian label, e.g. "11:00"
}

export interface BookingPaymentParams extends BookingConfirmParams {
  patientName:  string;
  patientPhone: string; // 📱 carried so an "other person" booking keeps their contact
  forSelf:      string; // 🧑‍⚕️ "1" = self, "0" = someone else (string for URLSearchParams)
}

// ✅ Object.entries → string[][] — accepted by URLSearchParams, no cast needed
export const buildConfirmUrl  = (p: BookingConfirmParams):  string =>
  `/booking/confirm?${new URLSearchParams(Object.entries(p))}`;

export const buildPaymentUrl  = (p: BookingPaymentParams):  string =>
  `/booking/payment?${new URLSearchParams(Object.entries(p))}`;
