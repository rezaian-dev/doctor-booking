'use client';
import React, { useState } from 'react';
import BankOption from './BankOption';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IoIosArrowBack } from 'react-icons/io';

/**
 * 🧾 PaymentSummary Component
 *
 * Displays payment summary, bank gateways, terms checkbox,
 * and a submit button that is disabled until terms are accepted.
 */
const PaymentSummary: React.FC = () => {
  // 🏦 Selected bank state
  const [selectedBank, setSelectedBank] = useState('bank-saman');
  // ✅ Terms acceptance state
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // 🖱️ Handle bank selection
  const handleBankChange = (bankId: string) => () => {
    setSelectedBank(bankId);
  };

  // ✅ Handle terms checkbox toggle
  const handleTermsChange = (checked: boolean) => {
    setIsTermsAccepted(checked);
  };

  return (
    <div className="rounded-[12px] p-3 md:p-4 border border-neutral-100 space-y-3">
      {/* 💰 Payment details */}
      <div className="border border-neutral-100 p-5 rounded-t-[10px]">
        <h3 className="text-neutral-850 font-medium text-lg mb-[15px]">
          جزئیات پرداخت
        </h3>
        <div className="space-y-[15px] [&>div:last-child]:mt-[30px]">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-neutral-700">
              مبلغ ویزیت:
            </span>
            <span className="font-bold text-sm text-neutral-850">
              ۲۰۰،۰۰۰ تومان
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-neutral-700">
              هزینه کارمزد:
            </span>
            <span className="font-bold text-sm text-neutral-850">
              ۲۰،۰۰۰ تومان
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-neutral-700">
              مبلغ نهایی:
            </span>
            <span className="font-bold text-sm text-neutral-850">
              ۲۲۰،۰۰۰ تومان
            </span>
          </div>
        </div>
      </div>

      {/* 🏦 Payment gateways */}
      <div className="border border-neutral-100 p-5 rounded-b-[10px]">
        <h3 className="text-neutral-850 font-medium text-lg mb-[15px]">
          درگاه پرداخت آنلاین
        </h3>
        <div className="space-y-[11px]">
          <BankOption
            id="bank-saman"
            name="payment-gateway"
            logoSrc="/images/logo-bank-saman.png"
            bankName="بانک سامان"
            isSelected={selectedBank === 'bank-saman'}
            onChange={handleBankChange('bank-saman')}
          />
          <BankOption
            id="bank-parsian"
            name="payment-gateway"
            logoSrc="/images/logo-parsian.png"
            bankName="بانک پارسیان"
            isSelected={selectedBank === 'bank-parsian'}
            onChange={handleBankChange('bank-parsian')}
          />
        </div>
      </div>

      {/* ✅ Terms agreement */}
      <div className="flex *:cursor-pointer items-center gap-x-2">
        <Checkbox
          id="payment-terms"
          checked={isTermsAccepted}
          onCheckedChange={handleTermsChange}
          className="mt-0.5 data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
        />
        <label className="text-neutral-850 text-xs" htmlFor="payment-terms">
          پرداخت به منزله پذیرش شرایط و قوانین است.
        </label>
      </div>

      {/* ▶️ Submit button — disabled until terms are accepted */}
      <Button
        disabled={!isTermsAccepted}
        className="w-full cursor-pointer h-[49px] rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white text-base font-medium flex items-center justify-center gap-x-2 transition-colors"
      >
        پرداخت
        <IoIosArrowBack size={20} className="text-white" />
      </Button>
    </div>
  );
};

export default PaymentSummary;
