'use client';
import React, { useState } from 'react';
import BankOption from './BankOption';
import ContinueButton from '../../ContinueButton';

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
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsAccepted(e.target.checked);
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
      <div className="flex items-center gap-x-2">
        <input
          type="checkbox"
          id="payment-terms"
          className="size-4 mt-0.5"
          checked={isTermsAccepted}
          onChange={handleTermsChange}
        />
        <label className="text-neutral-850 text-xs" htmlFor="payment-terms">
          پرداخت به منزله پذیرش شرایط و قوانین است.
        </label>
      </div>

      {/* ▶️ Submit button — disabled until terms are accepted */}
      <ContinueButton
        text="پرداخت"
        mode="payment"
        disabled={!isTermsAccepted}
      />
    </div>
  );
};

export default PaymentSummary;
