'use client';

import {
  CancelSquareIcon,
  FilterIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MultiSelectFilter from './multi-select-filter';
import ToggleFilter from './toggle-filter';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetContent,
  SheetDescription,
} from '@/components/ui/sheet';
import { FilterConfig, FilterFormData } from '@/types/filter.types';

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

interface DoctorFiltersSheetProps {
  onApply: (data: FilterFormData) => void;
  setIsOpen: (isOpen: boolean) => void;
  mode: '/doctors' | '/find-doctor';
}

const DoctorFiltersSheet = ({
  onApply,
  setIsOpen,
  mode,
}: DoctorFiltersSheetProps) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

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

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    register,
  } = methods;

  const toggleSection = (sectionId: string) => {
    setOpenSection(prev => (prev === sectionId ? null : sectionId));
  };

  const handleReset = () => {
    reset();
    setOpenSection(null);
  };

  const handleApply = (data: FilterFormData) => {
    onApply(data);
    setIsOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <SheetContent side="right" className="p-0 max-w-90 sm:max-w-[320px]">
        <form
          onSubmit={handleSubmit(handleApply)}
          className="flex h-full flex-col"
        >
          {/* 🎯 Header */}
          <SheetHeader className="relative px-4 py-4 border-b border-neutral-100">
            <SheetTitle className="flex items-center justify-center gap-x-2 text-lg font-medium">
              <HugeiconsIcon icon={FilterIcon} size={20} />
              <span>فیلترها</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              تنظیم فیلترهای جستجو برای پیدا کردن پزشک
            </SheetDescription>

            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                aria-label="بستن صفحه فیلترها"
              >
                <HugeiconsIcon icon={CancelSquareIcon} size={20} />
              </Button>
            </SheetClose>
          </SheetHeader>

          {/* 📜 Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* 🔍 Search */}
            {mode === '/doctors' && (
              <div className="pb-5 border-b border-neutral-100">
                <div className="h-12 flex items-center px-3 xs:px-4 border border-neutral-200 rounded-xl">
                  <input
                    {...register('search')}
                    placeholder="جستجو پزشک"
                    className="w-full h-full outline-none text-sm text-neutral-600 placeholder:text-neutral-400"
                  />
                  <HugeiconsIcon
                    icon={Search01Icon}
                    color="#888888"
                    size={20}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  نام یا تخصص مورد نظرتان را وارد کنید.
                </p>
              </div>
            )}

            {/* 🎛️ Filters */}
            {FILTERS.map(filter => (
              <MultiSelectFilter
                key={filter.id}
                filter={filter}
                isOpen={openSection === filter.id}
                onToggle={() => toggleSection(filter.id)}
              />
            ))}

            <ToggleFilter />
          </div>

          {/* ✅ Footer */}
          <SheetFooter className="border-t border-neutral-100 p-4">
            <div className="flex items-center gap-x-3 w-full">
              <Button
                type="button"
                onClick={handleReset}
                disabled={!isDirty}
                variant="outline"
                className={clsx(
                  'flex-1 h-10 text-xs xs:text-sm',
                  !isDirty && 'text-neutral-400 cursor-not-allowed'
                )}
              >
                حذف همه فیلترها
              </Button>

              <Button
                type="submit"
                disabled={!isDirty}
                className={clsx(
                  'flex-1 h-10 text-xs xs:text-sm',
                  isDirty
                    ? 'bg-primary-500 hover:bg-primary-600'
                    : 'bg-primary-100 cursor-not-allowed'
                )}
              >
                اعمال فیلتر
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </FormProvider>
  );
};

export default DoctorFiltersSheet;
