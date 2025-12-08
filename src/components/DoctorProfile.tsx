'use client';
import { AlarmClockIcon, MapPinpoint02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa6';
import { GoCheckCircle } from 'react-icons/go';
import BioSection from './templates/booking/BioSection';
import clsx from 'clsx';
import ContinueButton from './ContinueButton';
import Link from 'next/link';

interface ProfileProps {
  mode: 'payment' | 'confirm' | 'default' | 'find-doctor';
}

const DoctorProfile = ({ mode }: ProfileProps) => {
  const doctorData = {
    name: 'دکتر زهرا وارسته',
    specialty: 'متخصص قلب و عروق',
    image: '/images/2.png',
    rating: 4,
    reviewsCount: 105,
    medicalCode: '۴۰۲۲۳',
    address: 'تهران، ستارخان، خیابان هفتم، پلاک ۴۰',
    nextAvailableSlot: 'دوشنبه ۲۴ دی',
    bio: 'دارای بورد تخصصی بیماری های نوزادان و کودکان با بیش از بیست سال سابقه فعالیت در زمینه تشخیص و درمان اختلالات گوارشی آلرژیک رشد و نمو نوزادان و کودکان و مشکلات رشد و بلوغ در نوجوانان در مطب خدمات تخصصی شامل سونوگرافی شکم برای بررسی وضعیت گوارشی و اندام های داخلی تست حساسیت به کازئین شیر برای تشخیص آلرژی های پروتئینی تست حساسیت به لاکتوز شیر جهت شناسایی عدم تحمل لاکتوز تست تنفسی اسپیرومتری برای بررسی عملکرد ریوی و تشخیص بیماری های تنفسی ارائه می شود همچنین حضور دستیار کارشناس ارشد مشاور کودکان و نوجوانان جهت ارائه راهنمایی های تکمیلی پاسخگویی به پرسش های والدین و همراهی در روند درمان فراهم شده است هدف ما پایش دقیق رشد سلامت و کیفیت زندگی کودکان و نوجوانان با رویکردی علمی صبورانه و دلسوزانه می باشد',
  } as const;

  const generateStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => i < rating);
  const stars = generateStars(doctorData.rating);

  return (
    <>
      {/* 🏥 Main card container */}
      <div className="relative bg-white rounded-[10px] border overflow-hidden sm:overflow-visible border-neutral-100">
        {/* 👤 Doctor header section */}
        <div
          className={clsx(
            mode === 'payment' && 'xs:p-4 sm:p-5',
            (mode === 'default' || mode === 'confirm' ||  mode === "find-doctor") && 'xs:p-3 xs:pb-[9px]'
          )}
        >
          <div className="flex xs:flex-row flex-col">
            {/* 🖼️ Doctor image */}
            <Image
              src={doctorData.image}
              width={186}
              height={153}
              alt={doctorData.name}
              className="min-h-full w-full xs:w-[186px] sm:aspect-186/153 object-cover xs:rounded-[6px]"
              priority
            />

            {/* 📝 Doctor info header */}
            <div className="flex items-start justify-between grow px-3 pt-3">
              <div className="flex flex-col gap-y-3">
                <h1 className="text-black font-medium text-lg">
                  {doctorData.name}
                </h1>
                <span className="text-neutral-950 text-sm font-medium">
                  {doctorData.specialty}
                </span>

                {/* 🌟 Star rating */}
                <div className="flex items-center gap-x-1.5 flex-wrap">
                  <div
                    className="flex flex-row-reverse justify-end items-center gap-x-1 shrink-0"
                    role="img"
                    aria-label={`امتیاز ${doctorData.rating} از ۵`}
                  >
                    {stars.map((filled, index) => (
                      <FaStar
                        key={index}
                        color={filled ? '#FFB800' : '#D1D1D1'}
                        size={12}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500 whitespace-nowrap">
                    ({doctorData.reviewsCount.toLocaleString('fa-IR')} نظر)
                  </span>
                </div>
              </div>

              {/* 🏅 Medical code - Desktop only */}
              <div className="hidden lg:flex items-center gap-x-2">
                <GoCheckCircle size={24} color="#4F4F4F" />
                <span className="text-[13px] text-medium-gray">
                  کد نظام پزشکی: {doctorData.medicalCode}
                </span>
              </div>
            </div>
          </div>

          {/* 📍 Additional info section — ONLY in default mode */}
          {(mode === 'default' || mode === 'confirm' ||  mode === "find-doctor") && (
            <div className="mt-3 xs:mt-2.5 px-3 xs:px-0 sm:px-0 pb-3 xs:pb-0">
              {/* 🏅 Medical code - Mobile/Tablet */}
              <div className="flex lg:hidden items-center gap-x-2 sm:gap-x-4 mb-2">
                <GoCheckCircle
                  className="shrink-0 size-4 xs:size-5"
                  size={20}
                  color="#4F4F4F"
                />
                <span className="text-xs xs:text-sm text-medium-gray">
                  کد نظام پزشکی: {doctorData.medicalCode}
                </span>
              </div>

              {/* 📍 Address & Next Slot — Default mode only */}
              <div className="space-y-2">
                <div className="flex items-center gap-x-1 xs:gap-x-2">
                  <HugeiconsIcon
                    icon={MapPinpoint02Icon}
                    size={20}
                    color="#262626"
                  />
                  <span className="font-medium text-xs xs:text-sm text-neutral-950 whitespace-nowrap">
                    آدرس مطب:
                  </span>
                  <span className="text-neutral-850 text-xs xs:text-sm font-medium line-clamp-1">
                    {doctorData.address}
                  </span>
                </div>

                <div className="flex items-center gap-x-1 xs:gap-x-2">
                  <HugeiconsIcon
                    icon={AlarmClockIcon}
                    size={20}
                    color="#262626"
                  />
                  <span className="font-medium text-xs xs:text-sm text-neutral-950 whitespace-nowrap">
                    اولین نوبت در دسترس:
                  </span>
                  <span className="text-neutral-850 text-xs xs:text-sm font-medium line-clamp-1">
                    {doctorData.nextAvailableSlot}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 📋 Payment-specific details — ONLY in payment mode */}
          {mode === 'payment' && (
            <div className="mt-3 xs:mt-[18px] px-3 xs:px-0 sm:px-0 pb-3 xs:pb-0">
              {/* 🏅 Medical code - Mobile/Tablet */}
              <div className="flex lg:hidden items-center gap-x-2 sm:gap-x-4 mb-2">
                <GoCheckCircle
                  className="shrink-0 size-4 xs:size-5"
                  size={20}
                  color="#4F4F4F"
                />
                <span className="text-xs xs:text-sm text-medium-gray">
                  کد نظام پزشکی: {doctorData.medicalCode}
                </span>
              </div>

              {/* 📋 Full details table — for payment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2 rounded-[6px] ">
                  <span className="font-medium text-xs xs:text-sm text-neutral-600">
                    آدرس مطب:
                  </span>
                  <span className="text-neutral-850 text-xs xs:text-sm font-medium">
                    {doctorData.address}
                  </span>
                </div>

                <div className="flex justify-between items-center px-2 rounded-[6px] ">
                  <span className="font-medium text-xs xs:text-sm text-neutral-600">
                    نوع نوبت:
                  </span>
                  <span className="text-neutral-850 text-xs xs:text-sm font-medium">
                    حضوری
                  </span>
                </div>

                <div className="flex justify-between items-center px-2 rounded-[6px] ">
                  <span className="font-medium text-xs xs:text-sm text-neutral-600">
                    زمان نوبت:
                  </span>
                  <span className="text-neutral-850 text-xs xs:text-sm font-medium">
                    دوشنبه ۲۴ دی ساعت ۹:۳۰
                  </span>
                </div>

                <div className="flex justify-between items-center px-2 rounded-[6px] ">
                  <span className="font-medium text-xs xs:text-sm text-neutral-600">
                    مراجعه کننده:
                  </span>
                  <span className="text-neutral-850 text-xs xs:text-sm font-medium">
                    علی مهدوی
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {mode === 'default' && <hr className="hidden md:block" />}

        {/* 📋 Bio section — desktop only */}
        {mode === 'default' && (
          <BioSection
            bio={doctorData.bio}
            title={doctorData.name}
            className="hidden md:block"
          />
        )}
        {mode === 'find-doctor' && (
          <div className="flex items-center px-3 justify-center mt-4 mb-4 md:mb-6 flex-col xs:flex-row gap-x-3 lg:gap-x-[46px] gap-y-4 mx-auto">
            <ContinueButton text="رزرو نوبت" mode={'doctor-find'} />
            <Link
              href={'#'}
              className="text-sm font-medium text-neutral-500 bg-white h-10 rounded-xl border border-neutral-100 flex items-center w-full justify-center max-w-[330px]"
            >
              مشاهده پروفایل
            </Link>
          </div>
        )}
      </div>

      {/* 📋 Bio section — mobile/tablet only */}
      {mode === 'default' && (
        <BioSection
          bio={doctorData.bio}
          title={doctorData.name}
          className="mt-6 block md:hidden"
        />
      )}
    </>
  );
};

export default DoctorProfile;
