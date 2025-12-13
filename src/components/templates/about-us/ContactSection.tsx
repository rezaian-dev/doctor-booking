import { Call02Icon, SmartPhone01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { FC } from 'react';

// 📋 Contact information data structure
interface ContactCard {
  id: string;
  icon: typeof SmartPhone01Icon | typeof Call02Icon;
  label: string;
  phones: string[];
  iconClassName?: string;
}

// 📞 Contact cards configuration
const CONTACT_CARDS: ContactCard[] = [
  {
    id: 'consultation',
    icon: SmartPhone01Icon,
    label: 'جهت مشاوره',
    phones: ['۰۹۱۲ ۳۴۵ ۶۷۸۹', '۰۹۱۲ ۳۴۵ ۶۷۹۰'],
  },
  {
    id: 'complaints',
    icon: Call02Icon,
    label: 'جهت شکایات و انتقادات',
    phones: ['۰۲۱-۷۷ ۴۲۵۸۶۷', '۰۲۱-۷۷ ۴۲۵۸۶۸'],
    iconClassName: 'rotate-y-180',
  },
];


// 📱 Main contact section component
const ContactSection: FC = () => {
  return (
    <section className="container px-4 md:px-8 mt-[43px] md:mt-[135px]">
      {/* 🎯 Section header */}
      <h2 className="text-black text-2xl font-bold mb-6">اطلاعات تماس</h2>

      {/* 📇 Contact cards grid with decorative element */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
        {/* 🔄 Render contact cards dynamically */}
        {CONTACT_CARDS.map((card) => (
          <div key={card.id} className={'flex items-center flex-col sm:flex-row justify-center gap-y-6 sm:justify-between drop-shadow-[0_-8px_32px_rgba(0,0,0,0.05)] px-10 bg-white rounded-[10px] h-[179px] sm:h-[136px] border border-neutral-100'}>
            {/* 🏷️ Label section with icon */}
            <div className="flex items-center gap-x-2">
              <HugeiconsIcon
                icon={card.icon}
                color={"#3D3D3D"}
                size={24}
                className={card.iconClassName}
              />
              <span className={'text-black font-medium text-base sm:text-lg'}>{card.label}</span>
            </div>

            {/* 📞 Phone numbers list */}
            <div className={'flex flex-col text-black font-medium text-base sm:text-lg'}>
              {card.phones.map((phone, index) => (
                <span key={`${card.id}-phone-${index}`} dir="ltr">
                  {phone}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* 🎨 Decorative background image */}
        <div className="absolute hidden md:block bottom-52 lg:bottom-9 -right-[99px] -z-1 pointer-events-none">
          <Image
            src="/images/Group.png"
            alt="Decorative group illustration"
            width={196}
            height={159}
            priority={false}
            className='w-[196px] h-[159px]'
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;