'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import clsx from 'clsx';

// 📚 Static FAQ data (in Persian)
const faqs = [
  {
    question: 'چگونه می‌توانم نوبت رزرو کنم؟',
    answer:
      'پس از پیدا کردن پزشک مورد نظر، بر روی دکمه "رزرو نوبت" کلیک کنید. سپس، تاریخ و ساعت مورد نظر خود را از تقویم پزشک انتخاب کنید و اطلاعات خود را وارد کنید. پس از تایید، نوبت شما ثبت خواهد شد و پیامک تایید برای شما ارسال می‌شود.',
  },
  {
    question: 'چگونه می‌توانم پزشک مورد نظرم را پیدا کنم؟',
    answer:
      'از قسمت «جستجوی پزشک» در بالای صفحه، نام تخصص یا نام خانوادگی پزشک مورد نظر خود را وارد کنید. همچنین می‌توانید با فیلتر کردن بر اساس شهر، تخصص یا رتبه، پزشک مناسب را پیدا کنید.',
  },
  {
    question: 'آیا دکتر رزرو اپلیکیشن موبایل دارد؟',
    answer:
      'بله، ما اپلیکیشن موبایل را برای اندروید و iOS ارائه می‌دهیم. می‌توانید از طریق فروشگاه‌های گوگل پلی و اپ استور، اپلیکیشن را دانلود کنید و به راحتی نوبت‌ها را مدیریت کنید.',
  },
  {
    question: 'آیا دکتر رزرو فقط برای شهرهای خاص است؟',
    answer:
      'خیر، دکتر رزرو در تمام شهرهای بزرگ ایران فعال است و هر روز پزشکان بیشتری به شبکه ما ملحق می‌شوند. برای مشاهده پزشکان فعال در شهر شما، کافیست شهر خود را انتخاب کنید.',
  },
  {
    question: 'چگونه می‌توانم نوبت خود را لغو کنم؟',
    answer:
      'شما می‌توانید تا ۲۴ ساعت قبل از زمان نوبت، آن را از طریق صفحه «رزروهای من» در پروفایل خود لغو کنید. در صورت لغو به موقع، مبلغ پرداختی به‌صورت کامل بازگشت داده می‌شود.',
  },
  {
    question: 'آیا می‌توانم برای دیگری نوبت بگیرم؟',
    answer:
      'بله، شما می‌توانید برای خانواده یا نزدیکانتان نوبت بگیرید. کافیست در مرحله ثبت اطلاعات، نام و شماره تماس فرد مورد نظر را وارد کنید.',
  },
  {
    question: 'چگونه می‌توانم از وضعیت نوبت خود مطلع شوم؟',
    answer:
      'پس از رزرو، یک پیامک و ایمیل تأییدیه به شما ارسال می‌شود. همچنین می‌توانید وضعیت نوبت خود را در بخش «رزروهای من» در پروفایل خود مشاهده کنید.',
  },
  {
    question: 'آیا می‌توانم نظرات سایر بیماران را درباره پزشکان بخوانم؟',
    answer:
      'بله، در صفحه هر پزشک، بخشی به نام «نظرات بیماران» وجود دارد که می‌توانید تجربیات و نظرات بیماران قبلی را بخوانید. این نظرات به شما کمک می‌کند تا پزشک مناسب را انتخاب کنید.',
  },
  {
    question: 'آیا اطلاعات شخصی و پزشکی من در وبسایت شما محفوظ می‌ماند؟',
    answer:
      'بله، امنیت اطلاعات شما برای ما اولویت دارد. تمامی اطلاعات شخصی و پزشکی شما با استفاده از آخرین استانداردهای امنیتی و رمزنگاری ذخیره می‌شود و هیچ‌گاه به شخص ثالثی ارائه نمی‌شود.',
  },
  {
    question: 'چگونه می‌توانم هزینه ویزیت را پرداخت کنم؟',
    answer:
      'پس از انتخاب نوبت، سیستم به شما یک درگاه پرداخت امن هدایت می‌کند. می‌توانید با کارت بانکی، کیف پول الکترونیکی یا سایر روش‌های پرداخت آنلاین، هزینه را پرداخت کنید. پس از پرداخت موفق، نوبت شما تأیید می‌شود.',
  },
  {
    question: 'چگونه می‌توانم از عضویت پزشکان در وبسایت شما اطمینان حاصل کنم؟',
    answer:
      'تمامی پزشکان عضو دکتر رزرو، مجوزهای لازم را از وزارت بهداشت دریافت کرده‌اند و هویت آن‌ها توسط تیم ما تأیید شده است. شما می‌توانید در صفحه هر پزشک، اطلاعات مجوز و تحصیلات علمی او را مشاهده کنید.',
  },
  {
    question: 'آیا می‌توانم بدون اینترنت نوبت رزرو کنم؟',
    answer:
      'خیر، برای رزرو نوبت، نیاز به اتصال به اینترنت دارید. اما می‌توانید از طریق تماس تلفنی با مرکز پشتیبانی ما، نوبت خود را رزرو کنید. شماره تماس در بخش «تماس با ما» موجود است.',
  },
  {
    question: 'چگونه می‌توانم نزدیک‌ترین پزشک به محل سکونت خود را پیدا کنم؟',
    answer:
      'در صفحه جستجوی پزشک، می‌توانید شهر خود را انتخاب کنید و سپس با فیلتر کردن بر اساس فاصله (نزدیک‌ترین)، پزشکان را بر اساس فاصله از محل شما مرتب کنید. همچنین می‌توانید از نقشه برای مشاهده موقعیت دقیق پزشکان استفاده کنید.',
  },
  {
    question: 'آیا می‌توانم نسخه‌های الکترونیکی خود را از طریق وبسایت دریافت کنم؟',
    answer:
      'بله، پس از ویزیت، پزشک می‌تواند نسخه الکترونیکی را برای شما ارسال کند. شما می‌توانید این نسخه‌ها را در بخش «نسخه‌های من» در پروفایل خود مشاهده و دانلود کنید.',
  },
  {
    question: 'در صورت بروز مشکل در رزرو نوبت، چگونه می‌توانم با پشتیبانی تماس بگیرم؟',
    answer:
      'در صورت بروز هرگونه مشکل، می‌توانید از طریق بخش «تماس با ما» در بالای صفحه، با مرکز پشتیبانی ما تماس بگیرید یا از طریق ایمیل و چت آنلاین با ما در ارتباط باشید. تیم پشتیبانی ما ۲۴ ساعته آماده پاسخگویی به شماست.',
  },
] as const;

// 📦 Props for flexible usage
interface FaqAccordionProps {
  mode: 'preview' | 'full'; // 🧪 'preview' = show 7 items + link, 'full' = show all
  className?: string; // 🎨 Optional extra classes
}

// 🏗️ Reusable, route-agnostic FAQ accordion
const FaqAccordion = ({ mode, className }: FaqAccordionProps) => {
  // 🎯 Display 7 items in preview, all in full mode
  const displayedFaqs = mode === 'preview' ? faqs.slice(0, 7) : faqs;

  return (
    // 📐 Responsive container with conditional top margin (only in preview)
    <section
      className={clsx(
        'container relative z-0 px-4 md:px-8',
        {
          'mt-7.5 md:mt-23.5': mode === 'preview', // ⏫ Spacing only on homepage/preview
        },
        className
      )}
    >
      {/* 📌 Header: always show title, conditionally show "View All" */}
          {mode === 'preview' && (
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-neutral-975 line-clamp-2">
            سوالات متداول
          </h2>
          <div className="flex items-center gap-x-1.5">
            <Link
              href="/faq"
              className="font-medium text-xs sm:text-sm text-neutral-400 hover:text-neutral-600 transition-colors whitespace-nowrap"
              aria-label="View all frequently asked questions"
            >
              مشاهده همه
            </Link>
            <MdOutlineKeyboardArrowLeft
              size={20}
              className="text-neutral-400"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* 🗂️ Accordion: single-open, clean UI */}
      <Accordion
        type="single"
        collapsible
        className="w-full mt-4.5 p-6 border-[1.5px] rounded-2xl border-neutral-100"
      >
        {displayedFaqs.map(({ question, answer }) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger className="font-medium text-sm text-right sm:text-base py-5 cursor-pointer sm:px-5 text-black no-underline!">
              {question}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 sm:px-5">
              <p className="text-sm leading-7 text-neutral-975">{answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {mode ==="full" && <div className='absolute top-24 left-12 md:left-64 m-auto w-45.5 h-max md:w-max md:h-max -z-1 pointer-events-none'>
        <img src="/images/faq.png" alt="faq" />
      </div>}
    </section>
  );
};

export default FaqAccordion;
