'use client';
import {
  ArrowLeft02Icon,
  Call02Icon,
  InstagramIcon,
  Linkedin01Icon,
  SmartPhone01Icon,
  TelegramIcon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  // Quick navigation links 🧭
  const quickLinks = [
    { href: '/', label: 'صفحه اصلی' },
    { href: '/doctors', label: 'لیست پزشکان' },
    { href: '/faq', label: 'سوالات متداول' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
  ] as const;

  // Social media links data 🧠
  const socialLinks = [
    { href: 'https://wa.me/yournumber', icon: WhatsappIcon, label: 'واتساپ' },
    {
      href: 'https://instagram.com/yourhandle',
      icon: InstagramIcon,
      label: 'اینستاگرام',
    },
    { href: 'https://t.me/yourchannel', icon: TelegramIcon, label: 'تلگرام' },
    {
      href: 'https://linkedin.com/company/yourcompany',
      icon: Linkedin01Icon,
      label: 'لینکدین',
    },
  ] as const;

  // Contact numbers data 📱
  const mobileNumbers: readonly ContactItem[] = [
    { number: '۰۹۱۲ ۳۴۵ ۶۷۸۹', link: 'tel:09123456789' },
    { number: '۰۹۱۲ ۳۴۵ ۶۷۹۰', link: 'tel:09123456790' },
  ] as const;

  const officeNumbers: ContactItem[] = [
    { number: '۰۲۱-۷۷ ۴۲۵۸۶۷', link: 'tel:02177425867' },
    { number: '۰۲۱-۷۷ ۴۲۵۸۶۸', link: 'tel:02177425868' },
  ] as const;

  // ✅ Fixed: Proper type for contact items — now strongly typed 🛡️
  type ContactItem = { number: string; link: string };

  // ✅ Fixed: Render contact list with correct typing, RTL-aware text rendering 📞
  const renderContactList = (
    items: readonly ContactItem[],
    icon: IconSvgElement,
    iconColor: string = '#3D3D3D'
  ) => (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <HugeiconsIcon
        icon={icon}
        className={clsx(icon === Call02Icon && 'transform rotate-y-180')}
        color={iconColor}
        size={24}
        aria-hidden="true"
      />
      {items.map(({ link, number }) => (
        <a
          key={link}
          href={link}
          dir="ltr"
          className="text-neutral-850 text-sm hover:text-primary-500 transition-colors duration-200"
        >
          {number}
        </a>
      ))}
    </div>
  );

  return (
    <footer className="bg-gray-50">
      <div className="hidden md:block container px-4 md:px-8 pt-16 pb-7">
        {/* Main footer content 🧩 */}
        <div className="flex flex-col lg:flex-row gap-x-16 xl:gap-x-42 gap-y-8 border-b-[3px] border-dark-blue/10 pb-6.75">
          {/* Left section: Links & Contact 📋 */}
          <div className="flex flex-col justify-between md:flex-row gap-y-8 grow">
            {/* Quick links 🔗 */}
            <div>
              <h4 className="text-neutral-850 font-bold text-base mb-4">
                لینک‌های سریع
              </h4>
              <ul className="flex flex-col gap-y-3">
                {quickLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-neutral-850 hover:underline hover:text-primary-500 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal info ⚖️ */}
            <div>
              <h4 className="text-neutral-850 font-bold text-base mb-4">
                اطلاعات حقوقی
              </h4>
              <ul className="flex flex-col gap-y-3">
                <li className="text-sm text-neutral-850">
                  تمامی حقوق محفوظ است.
                </li>
                <li className="text-sm text-neutral-850">سال تأسیس: 2025</li>
              </ul>
            </div>

            {/* Contact info 📱 */}
            <div className="flex flex-col gap-y-9">
              <div>
                <h4 className="text-neutral-850 font-bold text-base mb-4">
                  شماره همراه
                </h4>
                {renderContactList(mobileNumbers, SmartPhone01Icon)}
              </div>
              <div>{renderContactList(officeNumbers, Call02Icon)}</div>
            </div>
          </div>

          {/* Right section: Newsletter subscription 📨 */}
          <div className="bg-custom-blue/8 rounded-[12px] flex flex-col gap-y-2.5 max-w-92.5 px-8 py-6">
            <h4 className="text-base/7 text-dark-blue">مشترک شوید</h4>
            <form
              className="flex items-center border-[1.5px] border-light-gray bg-white rounded-[6px] h-11"
              onSubmit={e => e.preventDefault()}
            >
              <input
                className="w-full outline-none h-full px-3 text-sm text-dark-blue placeholder:text-medium-gray"
                type="email"
                placeholder="آدرس ایمیل"
                aria-label="آدرس ایمیل"
                required // ✅ Added for better form UX
              />
              <button
                className="bg-primary-500 rounded-l-[10px] flex items-center justify-center w-13 h-11 hover:bg-primary-600 transition-colors duration-200"
                type="submit"
                aria-label="ثبت ایمیل"
              >
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={24}
                  color="#fff"
                  aria-hidden="true"
                />
              </button>
            </form>
            <p className="text-medium-gray text-sm/7 mt-2">
              اپلیکیشن رزرو نوبت برای گرفتن نوبت سریع و غیرحضوری و بهترین
              دکترهای متخصص با دکتر رزرو.
            </p>
          </div>
        </div>

        {/* Footer bottom: Socials & Brand 🏷️ */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6.75 gap-y-4">
          {/* Social media icons 🌐 */}
          <div className="flex items-center gap-x-3">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full p-1.5 hover:bg-gray-100 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer" // ✅ Already correct — well done!
              >
                <HugeiconsIcon
                  icon={icon}
                  size={26}
                  color="#141B34"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>

          {/* Brand logo & name 🏢 */}
          <div className="flex items-center gap-x-4">
            <Image
              src="/images/Logo.jpg"
              width={30}
              height={28}
              alt="لوگو دکتر رزرو"
              className="w-7.5 h-7 object-contain"
              loading="lazy"
              sizes="30px"
            />
            <h2 className="text-2xl font-bold">
              دکتر<span className="text-primary-500"> رزرو </span>
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
