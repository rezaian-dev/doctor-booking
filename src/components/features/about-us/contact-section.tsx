import { Phone, Smartphone, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import AosWrapper from '@/components/shared/aos-wrapper';
import { aosStagger } from '@/lib/utils/aos';

interface ContactCard {
  id: string;
  icon: LucideIcon;
  label: string;
  phones: string[];
}

const CONTACT_CARDS: ContactCard[] = [
  {
    id: 'consultation',
    icon: Smartphone,
    label: 'جهت مشاوره',
    phones: ['۰۹۱۲ ۳۴۵ ۶۷۸۹', '۰۹۱۲ ۳۴۵ ۶۷۹۰'],
  },
  {
    id: 'complaints',
    icon: Phone,
    label: 'جهت شکایات و انتقادات',
    phones: ['۰۲۱-۷۷ ۴۲۵۸۶۷', '۰۲۱-۷۷ ۴۲۵۸۶۸'],
  },
];

const ContactSection = () => {
  return (
    <section className="container px-4 md:px-8 mt-10.75 md:mt-33.75">
      <AosWrapper animation="fade-down">
        <h2 className="text-black text-2xl font-bold mb-6">اطلاعات تماس</h2>
      </AosWrapper>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
        {CONTACT_CARDS.map((card, i) => (
          <AosWrapper key={card.id} animation="fade-up" delay={aosStagger(i)}>
            <div className="flex items-center flex-col sm:flex-row justify-center gap-y-6 sm:justify-between drop-shadow-[0_-8px_32px_rgba(0,0,0,0.05)] px-10 bg-white rounded-[10px] h-44.75 sm:h-34 border border-neutral-100">
              <div className="flex items-center gap-x-2">
                <card.icon size={24} color="#3D3D3D" />
                <span className="text-black font-medium text-base sm:text-lg">
                  {card.label}
                </span>
              </div>

              <div className="flex flex-col text-black font-medium text-base sm:text-lg">
                {card.phones.map((phone, index) => (
                  <span key={`${card.id}-phone-${index}`} dir="ltr">
                    {phone}
                  </span>
                ))}
              </div>
            </div>
          </AosWrapper>
        ))}

        <div className="absolute hidden md:block bottom-52 lg:bottom-9 -right-24.75 -z-1 pointer-events-none">
          <Image
            src="/images/icon-group.png"
            alt="Decorative group illustration"
            width={196}
            height={159}
            loading="lazy"
            className="w-49 h-39.75"
            sizes="196px"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
