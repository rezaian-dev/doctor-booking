import React from 'react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import ContinueButton from '../../ContinueButton';

/**
 * 🧑‍💼 Patient Selection UI Component
 * Allows the user to select between booking for themselves or another person.
 * Includes a button to add more patients.
 */
const PatientSelector: React.FC = () => {
  return (
    <>
      {/* 📦 Main container with border, rounded corners, and spacing */}
      <div className="border border-neutral-100 rounded-[12px] bg-white p-4 space-y-4">
        {/* 🧭 Fieldset for grouping patient selection options */}
        <fieldset>
          {/* 🏷️ Legend for the fieldset */}
          <legend className="font-medium text-black text-lg">
            مراجعه کننده
          </legend>
          {/* 💬 Subtitle explaining the selection */}
          <span className="text-black text-[13px] block mt-1">
            برای چه کسی نوبت می‌گیرید؟
          </span>

          {/* 👤 Option for selecting 'self' */}
          <div className="rounded-[12px] border border-neutral-100 flex items-start gap-x-2 bg-neutral-30 py-[15px] px-[25px] cursor-pointer mt-3">
            {/* 🎚️ Radio input for 'self' selection */}
            <input
              type="radio"
              name="patient"
              id="self"
              className="size-4 mt-0.5"
              aria-label="برای خودم"
            />
            {/* 📝 Label and phone number for 'self' */}
            <div className="flex flex-col justify-center items-start gap-y-1.5">
              <label
                className="text-neutral-850 font-medium text-sm"
                htmlFor="self"
              >
                علی مهدوی (خودم)
              </label>
              <span className="text-medium-gray text-[11px]">۰۹۱۲۳۴۵۶۷۸۹</span>
            </div>
          </div>
        </fieldset>

        {/* ➕ Button to add another patient */}
        <button
          type="button"
          className="text-primary-500 cursor-pointer flex items-center justify-center gap-x-1 mx-auto font-medium text-xs mt-3"
        >
          دریافت نوبت برای شخص دیگر
          <HugeiconsIcon icon={Add01Icon} size={16} color="#4179F0" />
        </button>
      </div>

      {/* ▶️ Continue button to proceed to the next step */}
      <ContinueButton text={"ادامه"} mode={'default'} />
    </>
  );
};

export default PatientSelector;
