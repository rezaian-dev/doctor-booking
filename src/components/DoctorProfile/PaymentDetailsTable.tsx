import { DoctorData } from "@/types/doctorProfile";

// 📋 Payment Details Table
const PaymentDetailsTable = ({ data }: { data: DoctorData }) => {
  const rows = [
    { label: 'آدرس مطب:', value: data.address },
    { label: 'نوع نوبت:', value: 'حضوری' },
    { label: 'زمان نوبت:', value: 'دوشنبه ۲۴ دی ساعت ۹:۳۰' },
    { label: 'مراجعه کننده:', value: 'علی مهدوی' },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex justify-between items-center px-2 rounded-[6px]">
          <span className="font-medium text-xs xs:text-sm text-neutral-600">
            {row.label}
          </span>
          <span className="text-neutral-850 text-xs xs:text-sm font-medium">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PaymentDetailsTable;
