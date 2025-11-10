'use client';
import Link from 'next/link'; // 🔄 Next.js client-side navigation
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'; // 🡐 Left arrow icon
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // 🗂️ Custom Accordion UI components

// 💬 Type definition for each FAQ item
interface FaqItem {
  question: string;
  answer: string;
}

// 📚 Static FAQ data (in Persian)
const faqs: FaqItem[] = [
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
] as const;

// 🏠 FAQ Accordion Section for the Home Page
const HomeFaqAccordion = () => {
  return (
    // 📐 Section container with responsive horizontal padding
    <section className="container px-4 md:px-8 mt-7.5 md:mt-[94px]">

      {/* 🧭 Header with title and "View All" link */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-gray-800 line-clamp-2">
          سوالات متداول
        </h2>

        <div className="flex items-center gap-x-1.5">
          {/* 🔗 "View All" link to full FAQ page */}
          <Link
            href="/faq"
            className="font-medium text-xs sm:text-sm text-neutral-400 hover:text-neutral-600 transition-colors whitespace-nowrap"
            aria-label="View all frequently asked questions"
          >
            مشاهده همه
          </Link>

          {/* 🡐 Decorative left arrow icon */}
          <MdOutlineKeyboardArrowLeft
            size={20}
            className="text-neutral-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 🗂️ Accordion component */}
      <Accordion
        type="single"        // 🔒 Allow only one item open at a time
        collapsible          // 🔄 Allow closing the open item
        className="w-full mt-[18px] p-6 border-[1.5px] rounded-2xl border-neutral-100"
        defaultValue="item-1" // ⏭️ Pre-expand the first item (Note: this won't work as expected—see note below ⚠️)
      >
        {faqs.map(({ question, answer }) => (
          /* 📄 Each FAQ item */
          <AccordionItem key={question} value={question}>
            {/* ❓ Question trigger */}
            <AccordionTrigger className="font-medium text-base py-5 cursor-pointer px-5 text-black no-underline!">
              {question}
            </AccordionTrigger>
            {/* 💬 Answer content */}
            <AccordionContent className="flex flex-col gap-4 px-5">
              <p className="text-sm leading-7 text-neutral-975">{answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default HomeFaqAccordion;
