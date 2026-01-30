import { FC } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { IoIosArrowBack } from 'react-icons/io';

/**
 * 🧑‍💼 Patient Selection UI Component
 * Allows the user to select between booking for themselves or another person.
 * Includes a button to add more patients.
 */
const PatientSelector: FC = () => {
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
          <div className="rounded-[12px] border border-neutral-100 flex items-start gap-x-2 bg-neutral-30 py-3.75 px-6.25 cursor-pointer mt-3">
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
              <Label
                htmlFor="self"
                className="text-neutral-850 font-medium text-sm cursor-pointer"
              >
                علی مهدوی (خودم)
              </Label>
              <span className="text-medium-gray text-[11px]">۰۹۱۲۳۴۵۶۷۸۹</span>
            </div>
          </div>
        </fieldset>

        {/* ➕ Button to add another patient */}
        <Button
          type="button"
          variant="ghost"
          className="text-primary-500 hover:text-primary-600 hover:bg-transparent flex items-center justify-center gap-x-1 mx-auto font-medium text-xs h-auto p-0"
        >
          دریافت نوبت برای شخص دیگر
          <HugeiconsIcon icon={Add01Icon} size={16} color="currentColor" />
        </Button>
      </div>

      {/* ▶️ Continue button to proceed to the next step */}
      <Button
        className="w-full max-w-98.5 h-10 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium mx-auto flex items-center justify-center gap-x-1.5"
      >
        ادامه
        <IoIosArrowBack size={20} className="text-white" />
      </Button>
    </>
  );
};

export default PatientSelector;
