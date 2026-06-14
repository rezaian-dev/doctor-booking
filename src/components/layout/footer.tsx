import Link from "next/link";
import { Phone, Smartphone } from "lucide-react";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { QUICK_LINKS, MOBILE_NUMBERS, OFFICE_NUMBERS } from "@/lib/constants/footer-data";
import { FooterContactList, FooterLegalInfo, FooterSocialRow } from "@/components/layout/footer-shared";

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="hidden md:block container px-4 md:px-8 pt-16 pb-7">
        <div className="flex flex-col lg:flex-row gap-x-16 xl:gap-x-42 gap-y-8 border-b-[3px] border-dark-blue/10 pb-6.75">
          <div className="flex flex-col justify-between md:flex-row gap-y-8 grow">
            <div>
              <h4 className="text-neutral-850 font-bold text-base mb-4">لینک‌های سریع</h4>
              <ul className="flex flex-col gap-y-3">
                {QUICK_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-neutral-850 hover:underline hover:text-primary-500 transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <FooterLegalInfo />

            <div className="flex flex-col gap-y-9">
              <div>
                <h4 className="text-neutral-850 font-bold text-base mb-4">شماره همراه</h4>
                <FooterContactList items={MOBILE_NUMBERS} Icon={Smartphone} layout="stacked" />
              </div>
              <FooterContactList items={OFFICE_NUMBERS} Icon={Phone} layout="stacked" />
            </div>
          </div>
          <NewsletterForm />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-6.75 gap-y-4">
          <FooterSocialRow iconSize={26} />
          <div className="flex items-center gap-x-4">
            <img src="/images/logo.jpg" width={30} height={28} alt="لوگو دکتر رزرو" className="w-7.5 h-7 object-contain" loading="lazy" />
            <h2 className="text-2xl font-bold">دکتر<span className="text-primary-500"> رزرو </span></h2>
          </div>
        </div>
      </div>
    </footer>
  );
}
