'use client';
import { AlarmClockIcon, AlertSquareIcon, MapPinpoint02Icon } from '@hugeicons/core-free-icons';
import Image from 'next/image';
import clsx from 'clsx';
import BioSection from './templates/booking/BioSection';
import InfoRow from '@/components/DoctorProfile/InfoRow';
import MedicalCodeBadge from '@/components/DoctorProfile/MedicalCodeBadge';
import PaymentDetailsTable from '@/components/DoctorProfile/PaymentDetailsTable';
import ActionButtons from '@/components/DoctorProfile/ActionButtons';
import StarRating from '@/components/DoctorProfile/StarRating';
import { DoctorData, ProfileMode } from '@/types/doctorProfile';

interface DoctorProfileProps {
  mode: ProfileMode;
}

// 📊 Mock Data
const DOCTOR_DATA: DoctorData = {
  name: 'دکتر زهرا وارسته',
  specialty: 'متخصص قلب و عروق',
  image: '/images/2.png',
  rating: 4,
  reviewsCount: 105,
  medicalCode: '۴۰۲۲۳',
  address: 'تهران، ستارخان، خیابان هفتم، پلاک ۴۰',
  nextAvailableSlot: 'دوشنبه ۲۴ دی',
  bio: 'دارای بورد تخصصی بیماری های نوزادان و کودکان با بیش از بیست سال سابقه فعالیت در زمینه تشخیص و درمان اختلالات گوارشی آلرژیک رشد و نمو نوزادان و کودکان و مشکلات رشد و بلوغ در نوجوانان در مطب خدمات تخصصی شامل سونوگرافی شکم برای بررسی وضعیت گوارشی و اندام های داخلی تست حساسیت به کازئین شیر برای تشخیص آلرژی های پروتئینی تست حساسیت به لاکتوز شیر جهت شناسایی عدم تحمل لاکتوز تست تنفسی اسپیرومتری برای بررسی عملکرد ریوی و تشخیص بیماری های تنفسی ارائه می شود همچنین حضور دستیار کارشناس ارشد مشاور کودکان و نوجوانان جهت ارائه راهنمایی های تکمیلی پاسخگویی به پرسش های والدین و همراهی در روند درمان فراهم شده است هدف ما پایش دقیق رشد سلامت و کیفیت زندگی کودکان و نوجوانان با رویکردی علمی صبورانه و دلسوزانه می باشد',
};



// 🎨 Main Component
const DoctorProfile = ({ mode }: DoctorProfileProps) => {
  const showDefaultInfo = ['default', 'confirm', 'find-doctor'].includes(mode);
  const showBio = mode === 'default';
  const showActions = ['find-doctor', 'profile'].includes(mode);

  // 📐 Dynamic padding based on mode
  const containerPadding = mode === 'payment'
    ? 'xs:p-4 sm:p-5'
    : 'xs:p-3 xs:pb-[9px]';

  const containerClasses = clsx(
    'relative bg-white rounded-[10px] border overflow-hidden sm:overflow-visible border-neutral-100',
    mode === 'profile' && 'max-w-[882px] mx-auto'
  );

  return (
    <>
      <div className={containerClasses}>
        {/* 👤 Header Section */}
        <div className={containerPadding}>
          <div className="flex xs:flex-row flex-col">
            {/* 🖼️ Doctor Image */}
            <Image
              src={DOCTOR_DATA.image}
              width={186}
              height={153}
              alt={DOCTOR_DATA.name}
              className="min-h-full w-full xs:w-[186px] sm:aspect-186/153 object-cover xs:rounded-[6px]"
              priority
            />

            {/* 📝 Doctor Info */}
            <div className="flex items-start justify-between grow px-3 pt-3">
              <div className="flex flex-col gap-y-3">
                <h1 className="text-black font-medium text-lg">{DOCTOR_DATA.name}</h1>
                <span className="text-neutral-950 text-sm font-medium">
                  {DOCTOR_DATA.specialty}
                </span>
                <StarRating rating={DOCTOR_DATA.rating} reviewsCount={DOCTOR_DATA.reviewsCount} />
              </div>

              {/* 🏅 Desktop Medical Code */}
              <MedicalCodeBadge code={DOCTOR_DATA.medicalCode} className="hidden lg:flex" />
            </div>
          </div>

          {/* 📱 Mobile Medical Code + Additional Info */}
          {(showDefaultInfo || mode === 'payment' || mode === 'profile') && (
            <div className="mt-3 xs:mt-2.5 px-3 xs:px-0 sm:px-0 pb-3 xs:pb-0">
              <MedicalCodeBadge code={DOCTOR_DATA.medicalCode} className="flex lg:hidden mb-2" />

              {/* 📋 Mode-specific content */}
              {mode === 'payment' && <PaymentDetailsTable data={DOCTOR_DATA} />}

              {showDefaultInfo && (
                <div className="space-y-2">
                  <InfoRow
                    icon={MapPinpoint02Icon}
                    label="آدرس مطب:"
                    value={DOCTOR_DATA.address}
                  />
                  <InfoRow
                    icon={AlarmClockIcon}
                    label="اولین نوبت در دسترس:"
                    value={DOCTOR_DATA.nextAvailableSlot}
                  />
                </div>
              )}

              {mode === 'profile' && (
                <div className="space-y-4">
                  <InfoRow
                    icon={MapPinpoint02Icon}
                    label="آدرس مطب:"
                    value={DOCTOR_DATA.address}
                  />
                  <InfoRow
                    icon={AlarmClockIcon}
                    label="تاریخ نوبت :"
                    value={DOCTOR_DATA.nextAvailableSlot}
                  />
                  <InfoRow
                    icon={AlertSquareIcon}
                    label="کد پیگیری :"
                    value="۲۴۶۷۵۸۹۲"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 📋 Desktop Bio Section */}
        {showBio && (
          <>
            <hr className="hidden md:block" />
            <BioSection
              bio={DOCTOR_DATA.bio}
              title={DOCTOR_DATA.name}
              className="hidden md:block"
            />
          </>
        )}

        {/* 🔘 Action Buttons */}
        {showActions && <ActionButtons mode={mode} />}
      </div>

      {/* 📱 Mobile Bio Section */}
      {showBio && (
        <BioSection
          bio={DOCTOR_DATA.bio}
          title={DOCTOR_DATA.name}
          className="mt-6 block md:hidden"
        />
      )}
    </>
  );
};

export default DoctorProfile;
