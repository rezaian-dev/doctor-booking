import React from 'react';

export const BookingAlert: React.FC = () => (
  <div className="bg-red-50 rounded-3xl h-10 flex items-center gap-x-2 px-4">
    <span className="size-2 rounded-full bg-gray-500 inline-block mt-0.5" />
    <span className="text-xs sm:text-sm text-gray-700">
      نوبت شما هنوز تکمیل نشده است، برای ادامه پرداخت را انجام دهید.
    </span>
  </div>
);

export default BookingAlert;
