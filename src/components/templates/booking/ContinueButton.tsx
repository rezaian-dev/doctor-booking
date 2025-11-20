import Link from 'next/link';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

/**
 * ▶️ Continue Button Component
 * A reusable button that navigates to the next step in the booking flow.
 * Uses Link for client-side navigation and includes an arrow icon.
 */
const ContinueButton: React.FC = () => {
  return (
    <Link
      // 📍 Temporary href for UI demonstration — will be updated in future
      href={'#'}
      // 🎨 Styling: primary color, rounded corners, arrow icon, centered layout
      className="bg-primary-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-x-1.5 h-10 w-full transition-colors cursor-pointer hover:bg-primary-600 max-w-[394px] mx-auto"
    >
      {/* 📝 Button label */}
      ادامه
      {/* ⬅️ Arrow icon pointing right (rotated via CSS) */}
      <IoIosArrowBack size={20} color="#fff" />
    </Link>
  );
};

export default ContinueButton;
