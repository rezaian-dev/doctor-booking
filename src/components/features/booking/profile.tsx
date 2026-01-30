'use client';
import { AlarmClockIcon, MapPinpoint02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa6';
import { GoCheckCircle } from 'react-icons/go';
import BioSection from './bio-section';

interface ProfileProps {
  showBio: boolean;
}

// 👨‍⚕️ Main Profile Component
const Profile = ({ showBio = true }: ProfileProps) => {
  // 📊 Static doctor data configuration
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

  // 🌟 Generate star rating array based on rating value
  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  };
  // 🌟 Generate stars array
  const stars = generateStars(doctorData.rating);

  return (
    <>
      {/* 🏥 Main card container */}
      <div className="relative bg-white rounded-[10px] border overflow-hidden sm:overflow-visible border-neutral-100">
        {/* 👤 Doctor header section */}
        <div className="xs:p-3">
          <div className="flex xs:flex-row flex-col">
            {/* 🖼️ Doctor image */}
            <Image
              src={doctorData.image}
              width={186}
              height={153}
              alt={doctorData.name}
              className="xs:rounded-tr-[6px] min-h-full w-full xs:w-46.5 sm:aspect-186/153 object-cover xs:rounded-br-[6px]"
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

          {/* 📍 Additional info section */}
          <div className="flex flex-col gap-y-3 sm:gap-y-1.75 md:px-1 px-3 xs:px-0 sm:px-0 pb-3 xs:pb-0 mt-1.75">
            {/* 🏅 Medical code - Mobile/Tablet */}
            <div className="flex lg:hidden items-center gap-x-2 sm:gap-x-4">
              <GoCheckCircle className="shrink-0" size={20} color="#4F4F4F" />
              <span className="text-sm text-medium-gray">
                کد نظام پزشکی: {doctorData.medicalCode}
              </span>
            </div>

            {/* 📍 Address */}
            <div className="flex items-center gap-x-2 sm:gap-x-4">
              <HugeiconsIcon
                className="shrink-0"
                icon={MapPinpoint02Icon}
                size={20}
                color="#262626"
              />
              <span className="font-medium text-sm text-neutral-950 line-clamp-1">
                آدرس مطب: {doctorData.address}
              </span>
            </div>

            {/* ⏰ Next available slot */}
            <div className="flex items-center gap-x-2 sm:gap-x-4">
              <HugeiconsIcon
                className="shrink-0"
                icon={AlarmClockIcon}
                size={20}
                color="#262626"
              />
              <span className="font-medium text-sm text-neutral-600">
                اولین نوبت در دسترس:{' '}
                <span className="text-neutral-950">
                  {doctorData.nextAvailableSlot}
                </span>
              </span>
            </div>
          </div>
        </div>

        {showBio && <hr className="hidden md:block" />}

        {/* 📋 Bio section — desktop only */}
        {showBio && (
          <BioSection
            bio={doctorData.bio}
            title={doctorData.name}
            className="hidden md:block"
          />
        )}
      </div>

      {/* 📋 Bio section — mobile/tablet only */}
      {showBio && (
        <BioSection
          bio={doctorData.bio}
          title={doctorData.name}
          className="mt-6 block md:hidden"
        />
      )}
    </>
  );
};

export default Profile;
