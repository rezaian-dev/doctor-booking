import { FC } from 'react';

// ✅ Success feedback banner — stable height, no layout shift
const SuccessMessage: FC = () => {
  return (
    <div className="mb-6 p-4 bg-green-50 border-r-4 border-green-500 rounded-lg min-h-11 flex items-center">
      <p className="text-green-700 font-medium">✅ پیام شما با موفقیت ارسال شد!</p>
    </div>
  );
};

export default SuccessMessage;
