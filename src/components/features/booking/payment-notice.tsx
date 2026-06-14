// 🛡️ Reassurance panel shown beside the payment summary
const PaymentNotice = () => {
  return (
    <div className="bg-white rounded-[12px] py-6 px-5 mb-6 lg:mb-0  border border-neutral-100">
      {/* Header */}
      <h3 className="font-medium mb-4 text-lg text-black">
        با اطمینان نوبت خود را ثبت کنید
      </h3>

      {/* Benefits List */}
      <ul className="space-y-4 list-disc list-inside mr-1 text-sm text-black">
        <li>امکان لغو نوبت</li>
        <li>امکان بازگشت وجه</li>
        <li>امکان ویرایش نوبت</li>
      </ul>
    </div>
  );
};

export default PaymentNotice;
