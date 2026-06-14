import Link from "next/link";
import { Phone, Smartphone } from "lucide-react";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { QUICK_LINKS, MOBILE_NUMBERS, OFFICE_NUMBERS, SOCIAL_LINKS } from "@/lib/constants/footer-data";
import { FooterContactList, FooterLegalInfo, FooterSocialRow } from "@/components/layout/footer-shared";

export default function FooterMobile() {
  return (
    <section className="block md:hidden bg-gray-50 border-t border-neutral-100 rounded-t-4xl">
      <div className="container px-4 pt-10">
        <div className="flex justify-between flex-wrap gap-x-8 gap-y-6">
          <div>
            <h4 className="text-neutral-850 font-medium text-[15px] mb-4">لینک‌های سریع</h4>
            <ul className="flex flex-col gap-y-1.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-neutral-850 hover:text-primary-500 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-neutral-850 font-medium text-[15px] mb-4">اطلاعات تماس</h4>
            <FooterContactList items={MOBILE_NUMBERS} Icon={Smartphone} layout="inline" />
            <div className="mt-4"><FooterContactList items={OFFICE_NUMBERS} Icon={Phone} layout="inline" /></div>
          </div>

          <FooterLegalInfo />

          {SOCIAL_LINKS.length > 0 && (
            <div>
              <h4 className="font-medium text-[15px] text-neutral-850 mb-4">ما را دنبال کنید</h4>
              <FooterSocialRow iconSize={20} />
            </div>
          )}
        </div>

        <NewsletterForm compact />

        <div className="mt-6 pt-6 border-t pb-10 border-neutral-100">
          <div className="flex items-center justify-end gap-x-2">
            <img src="/images/logo.jpg" width={25} height={25} alt="لوگو دکتر رزرو" className="w-7.5 h-7 object-contain" />
            <h2 className="text-xl font-bold">دکتر<span className="text-primary-500"> رزرو </span></h2>
          </div>
        </div>
      </div>
    </section>
  );
}
