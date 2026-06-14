'use client';
import Image from 'next/image';

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
const BankOption = ({
  id,
  name,
  logoSrc,
  bankName,
  isSelected,
  onChange,
}: BankOptionProps) => (
  <div className="flex h-14 items-center justify-between gap-x-3 rounded-xl border border-neutral-100 px-4">
    <label htmlFor={id} className="flex min-w-0 cursor-pointer items-center gap-x-2">
      <Image
        src={logoSrc}
        width={24}
        height={24}
        alt={`لوگوی بانک ${bankName}`}
        className="shrink-0"
        loading="lazy"
        sizes="24px"
      />
      <span className="min-w-0 truncate text-sm font-medium text-neutral-850">{bankName}</span>
    </label>
    <input
      type="radio"
      id={id}
      name={name}
      className="size-5 shrink-0 cursor-pointer accent-primary-500"
      checked={isSelected}
      onChange={onChange}
    />
  </div>
);

export default BankOption;
