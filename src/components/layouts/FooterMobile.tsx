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
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


const FooterMobile: React.FC = () => {
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
    { href: 'https://instagram.com/yourhandle', icon: InstagramIcon, label: 'اینستاگرام' },
    { href: 'https://t.me/yourchannel', icon: TelegramIcon, label: 'تلگرام' },
    { href: 'https://linkedin.com/company/yourcompany', icon: Linkedin01Icon, label: 'لینکدین' },
  ] as const;

  // Contact numbers data 📱
  const phoneNumbers = [
    { number: '۰۹۱۲ ۳۴۵ ۶۷۸۹', link: 'tel:09123456789' },
    { number: '۰۹۱۲ ۳۴۵ ۶۷۹۰', link: 'tel:09123456790' },
  ] as const;

  const officeNumbers = [
    { number: '۰۲۱-۷۷ ۴۲۵۸۶۷', link: 'tel:02177425867' },
    { number: '۰۲۱-۷۷ ۴۲۵۸۶۸', link: 'tel:02177425868' },
  ] as const;

    // ✅ Type definition for contact items — improves type safety 🛡️
  type ContactItem = { readonly number: string; readonly link: string };

  // Function to render contact list 📞
  const renderContactList = (items: readonly ContactItem[], icon:IconSvgElement) => (
    <div className="flex items-center gap-2.5">
      <HugeiconsIcon icon={icon} color="#3D3D3D" size={24} aria-hidden="true" />
      <div className="flex flex-col gap-y-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="text-neutral-850 text-sm"
            dir="ltr"
          >
            {item.number}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <section className="block md:hidden bg-gray-50 border-t border-neutral-100 rounded-t-4xl">
      <div className="container px-4 pt-10">
        <div className="flex justify-between flex-wrap gap-x-8 gap-y-6">
          {/* Quick links 🔗 */}
          <div>
            <h4 className="text-neutral-850 font-medium text-[15px] mb-4">
              لینک‌های سریع
            </h4>
            <ul className="flex flex-col gap-y-1.5">
              {quickLinks.map((link, index) => (
                <li key={link.href}> {/* Changed key to href for better uniqueness */}
                  <Link href={link.href} className="text-xs text-neutral-850 hover:text-primary-500 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info 📱 */}
          <div>
            <h4 className="text-neutral-850 font-medium text-[15px] mb-4">
              اطلاعات تماس
            </h4>
            {renderContactList(phoneNumbers, SmartPhone01Icon)}
            <div className="mt-4">
              {renderContactList(officeNumbers, Call02Icon)}
            </div>
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
              <li className="text-sm text-neutral-850">
                سال تأسیس یا بروزرسانی: 2025
              </li>
            </ul>
          </div>

          {/* Social media icons 🌐 */}
          <div>
            <h4 className="font-medium text-[15px] text-neutral-850 mb-4">
              ما را دنبال کنید
            </h4>
            <div className="flex items-center gap-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.href} // Using href as key for better uniqueness
                  href={social.href}
                  aria-label={social.label}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full p-1.5 hover:bg-gray-100 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HugeiconsIcon
                    icon={social.icon}
                    size={20}
                    color="#141B34"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter subscription 📨 */}
        <div className="bg-custom-blue/8 rounded-[12px] flex flex-col gap-y-2.5 mt-6 max-w-[370px] p-4">
          <h4 className="text-base/7 text-dark-blue">مشترک شوید</h4>
          <form
            className="flex items-center border-[1.5px] border-light-gray bg-white rounded-[6px] h-11"
            onSubmit={(e) => e.preventDefault()} // Consider adding actual submission logic
          >
            <input
              className="w-full outline-none h-full px-3 text-sm text-dark-blue"
              type="email"
              placeholder="آدرس ایمیل"
              aria-label="آدرس ایمیل"
            />
            <button
              className="bg-primary-500 rounded-l-[10px] flex items-center justify-center w-[52px] h-11 hover:bg-primary-600 transition-colors duration-200"
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
          <p className="text-medium-gray text-[13px] mt-2">
            اپلیکیشن رزرو نوبت برای گرفتن نوبت سریع و غیرحضوری و بهترین دکترهای
            متخصص با دکتر رزرو.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t pb-10 border-neutral-100">
          {/* Brand logo & name 🏢 */}
          <div className="flex items-center justify-end gap-x-2">
            <Image
              src="/images/Logo.jpg"
              width={25}
              height={25}
              alt="لوگو دکتر رزرو"
              className="w-[30px] h-7 object-contain"
            />
            <h2 className="text-xl font-bold">
              دکتر<span className="text-primary-500"> رزرو </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterMobile;
