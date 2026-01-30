import { FC } from 'react';
import { ChromeIcon, InstagramIcon, TelephoneIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const DoctorContact: FC = () => {
  const items = [
    { id: 'website', icon: ChromeIcon, label: 'drZahravaraste.ir', href: 'https://drZahravaraste.ir', ariaLabel: 'Visit website' },
    { id: 'phone', icon: TelephoneIcon, label: '۰۲۱-۱۲۳۴ ۵۶۷۶۷', href: 'tel:021123456767', ariaLabel: 'Call +98 21 1234 56767' },
    { id: 'instagram', icon: InstagramIcon, label: 'instagram.com/dr.zahravaraste', href: 'https://instagram.com/dr.zahravaraste', ariaLabel: 'Follow on Instagram' },
  ] as const;

  return (
    <div className="mt-6 md:mt-10 p-5 md:border md:border-neutral-100 rounded-[12px]">
      <h4 className="font-medium text-lg text-black">راه‌های ارتباطی</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[52px] mt-3 gap-2 md:gap-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-center gap-x-3 rounded-xl border border-neutral-100 truncate">
            <HugeiconsIcon icon={item.icon} size={20} color="#3D3D3D" className="shrink-0" />
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-850 truncate"
              aria-label={item.ariaLabel}
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorContact;
