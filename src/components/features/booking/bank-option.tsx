'use client';
import Image from 'next/image';
import React from 'react';

// 🏦 Props for a single bank payment option
export interface BankOptionProps {
  id: string;
  name: string; // radio group name
  logoSrc: string;
  bankName: string;
  isSelected: boolean;
  onChange: () => void;
}

// 🏦 Reusable bank selection item with logo and radio input
const BankOption: React.FC<BankOptionProps> = ({
  id,
  name,
  logoSrc,
  bankName,
  isSelected,
  onChange,
}) => (
  <div className="flex items-center justify-between border border-neutral-100 rounded-[12px] px-4 h-14">
    <label htmlFor={id} className="flex items-center gap-x-2 cursor-pointer">
      <Image
        src={logoSrc}
        width={24}
        height={24}
        alt={`لوگوی بانک ${bankName}`}
        className="shrink-0"
        loading="lazy"
        sizes="24px"
      />
      <span className="text-sm font-medium text-neutral-850">{bankName}</span>
    </label>
    <input
      type="radio"
      id={id}
      name={name}
      className="w-4 h-4 sm:w-6 sm:h-5 cursor-pointer"
      checked={isSelected}
      onChange={onChange}
    />
  </div>
);

export default BankOption;
