'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, FilterIcon, Search01Icon } from '@hugeicons/core-free-icons';
import MultiSelectFilter from './MultiSelectFilter';
import ToggleFilter from './ToggleFilter';
import type { FilterConfig, FilterFormData } from '@/types/filters';
import clsx from 'clsx';
import { useState } from 'react';

// 📋 Static filter configuration
const FILTERS: FilterConfig[] = [
  {
    id: 'specialties',
    title: 'تخصص‌ها',
    label: 'تخصص مورد نظر را انتخاب کنید',
    options: [
      { id: 'general', label: 'عمومی' },
      { id: 'dentistry', label: 'دندانپزشکی' },
      { id: 'cardiology', label: 'قلب و عروق' },
      { id: 'orthopedics', label: 'ارتوپدی' },
      { id: 'gynecology', label: 'زنان و زایمان' },
      { id: 'dermatology', label: 'پوست' },
      { id: 'psychiatry', label: 'روانپزشکی' },
      { id: 'neurology', label: 'مغز و اعصاب' },
      { id: 'ophthalmology', label: 'چشم‌پزشکی' },
      { id: 'ent', label: 'گوش، حلق و بینی' },
      { id: 'pediatrics', label: 'کودکان' },
      { id: 'endocrinology', label: 'غدد' },
      { id: 'gastroenterology', label: 'گوارش و کبد' },
      { id: 'urology', label: 'ادراری و تناسلی' },
      { id: 'oncology', label: 'انکولوژی (سرطان)' },
    ],
  },
  {
    id: 'insurances',
    title: 'بیمه',
    label: 'بیمه مورد نظر را انتخاب کنید',
    options: [
      { id: 'iran', label: 'ایران' },
      { id: 'tamin', label: 'تامین اجتماعی' },
      { id: 'azar', label: 'آذر' },
      { id: 'alborz', label: 'البرز' },
      { id: 'mellat', label: 'ملت' },
      { id: 'saman', label: 'سامان' },
      { id: 'ayandeh', label: 'آینده' },
      { id: 'tejarat', label: 'تجارت' },
      { id: 'dana', label: 'دانا' },
      { id: 'armed-forces', label: 'نیروهای مسلح' },
    ],
  },
  {
    id: 'experience',
    title: 'تجربه کاری',
    label: '۵ سال به بالا',
    options: [
      { id: '5+', label: '۵ سال به بالا' },
      { id: '10+', label: '۱۰ سال به بالا' },
      { id: '15+', label: '۱۵ سال به بالا' },
    ],
  },
  {
    id: 'availability',
    title: 'وضعیت نوبت دهی',
    label: 'وضعیت مورد نظر را انتخاب کنید',
    options: [
      { id: 'available-today', label: 'پزشکان دارای نوبت خالی' },
      { id: 'weekend', label: 'امکان رزرو در روزهای تعطیل' },
      { id: 'evening', label: 'نوبت عصر و شب' },
      { id: 'online-visit', label: 'ویزیت آنلاین' },
    ],
  },
  {
    id: 'city',
    title: 'شهر',
    label: 'شهر مورد نظر را انتخاب کنید',
    options: [
      { id: 'tehran', label: 'تهران' },
      { id: 'isfahan', label: 'اصفهان' },
      { id: 'shiraz', label: 'شیراز' },
      { id: 'mashhad', label: 'مشهد' },
      { id: 'tabriz', label: 'تبریز' },
      { id: 'karaj', label: 'کرج' },
      { id: 'ahvaz', label: 'اهواز' },
      { id: 'qom', label: 'قم' },
      { id: 'kermanshah', label: 'کرمانشاه' },
      { id: 'rasht', label: 'رشت' },
    ],
  },
];

export default function DoctorFilters() {
  // 🧠 Initialize form with default values
  const methods = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      specialties: [],
      insurances: [],
      experience: [],
      availability: [],
      city: [],
      gender: [],
    },
  });

  // 📦 Manage accordion open/close state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
    register,
  } = methods;

  // 🔄 Toggle accordion section open/close
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // 🧹 Reset form and close all accordions
  const handleReset = () => {
    reset();
    setOpenSections({}); // Close all accordions
  };

  // ✅ Handle form submission
  const handleApply = () => {
    console.log('✅ Applied Filters:', getValues());
    // TODO: sync with URL or send to API
  };

  return (
    <FormProvider {...methods}>
      {/* 📝 Wrap in <form> for proper submit behavior (Enter key, accessibility) */}
      <form onSubmit={handleSubmit(handleApply)}>
        <div className="p-4 hidden md:block rounded-xl border border-neutral-100 bg-white not-last:space-y-6">
          {/* 🎯 Header with reset button */}
          <div className="flex justify-between items-center mb-4">
            <div className='flex items-center gap-x-2'>
            <HugeiconsIcon icon={FilterIcon} />
            <h3 className="text-lg font-medium">فیلترها</h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className={clsx(
                'text-sm flex items-center gap-x-1 text-primary-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-primary-100 transition-colors',
                isDirty ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              حذف همه فیلترها
              <HugeiconsIcon size={16} color="#4179F0" icon={Cancel01Icon} />
            </button>
          </div>

          {/* 🔍 Search input */}
          <div className="pb-[18px] border-b border-neutral-100">
            <div className="h-12 flex items-center px-4 border border-neutral-200 rounded-xl">
              <input
                {...register('search')}
                placeholder="جستجو پزشک"
                className="w-full h-full outline-none text-sm text-neutral-600"
              />
              <HugeiconsIcon icon={Search01Icon} color="#888888" size={24} className='size-5 lg:size-6' />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              نام یا تخصص مورد نظرتان را وارد کنید.
            </p>
          </div>

          {/* 🎛️ Render all accordion filters */}
          {FILTERS.map(filter => (
            <MultiSelectFilter
              key={filter.id}
              filter={filter}
              isOpen={openSections[filter.id] || false}
              onToggle={() => toggleSection(filter.id)}
            />
          ))}

          {/* 👤 Gender filter (no accordion) */}
          <ToggleFilter />

          {/* ✅ Apply button — disabled if no changes */}
          <button
            disabled={!isDirty}
            type="submit"
            className={clsx(
              'w-full text-white py-3 rounded-lg transition-colors',
              isDirty
                ? 'bg-primary-500 cursor-pointer hover:bg-primary-700'
                : 'bg-primary-100 cursor-not-allowed'
            )}
          >
            اعمال فیلتر
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
