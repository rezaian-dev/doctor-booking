import { DoctorData } from "@/types/doctor";

interface PaymentDetailsTableProps {
  data: Partial<DoctorData>;
}

// 🔹 Single row — hidden when value is empty
const Row = ({ label, value }: { label: string; value?: string | undefined }) =>
  value ? (
    <div className="flex items-start justify-between gap-x-4 text-sm">
      <span className="text-neutral-500 shrink-0">{label}</span>
      <span className="text-neutral-850 font-medium text-left">{value}</span>
    </div>
  ) : null;

export default function PaymentDetailsTable({ data }: PaymentDetailsTableProps) {
  return (
    <div className="space-y-3 mt-1">
      <Row label="آدرس مطب:"      value={data.address}           />
      <Row label="نوع نوبت:"      value={data.visitType}         />
      <Row label="زمان نوبت:"     value={data.nextAvailableSlot} />
      <Row label="مراجعه‌کننده:" value={data.patientName}       />
    </div>
  );
}
