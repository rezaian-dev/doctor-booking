// ⚠️ Pending-payment reminder banner
export const BookingAlert = () => (
  <div className="flex min-h-10 items-start gap-x-2 rounded-2xl bg-red-50 px-4 py-2.5">
    <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-gray-500" />
    <span className="text-xs leading-relaxed text-gray-700 sm:text-sm">
      نوبت شما هنوز تکمیل نشده است، برای ادامه پرداخت را انجام دهید.
    </span>
  </div>
);

export default BookingAlert;
