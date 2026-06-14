'use client';

import { Globe, Instagram, Phone, type LucideIcon } from 'lucide-react';

interface ContactData {
  phone?:     string;
  website?:   string;
  instagram?: string;
}

type ContactItem = { id: string; icon: LucideIcon; label: string; href: string; ariaLabel: string };

const getItems = ({ phone, website, instagram }: ContactData): ContactItem[] => [
  website   && { id: 'website',   icon: Globe,     label: website,   href: website.startsWith('http') ? website : `https://${website}`, ariaLabel: 'Visit website'       },
  phone     && { id: 'phone',     icon: Phone,     label: phone,     href: `tel:${phone}`,                                               ariaLabel: 'Call doctor'         },
  instagram && { id: 'instagram', icon: Instagram, label: instagram, href: `https://instagram.com/${instagram.replace(/^@/, '')}`,       ariaLabel: 'Follow on Instagram' },
].filter(Boolean) as ContactItem[];

const Contact = ({ data }: { data?: ContactData }) => {
  if (!data) return null;
  const items = getItems(data);
  if (!items.length) return null;

  return (
    <div className="mt-6 md:mt-10 p-5 md:border md:border-neutral-100 rounded-[12px]">
      <h4 className="font-medium text-lg text-black">راه‌های ارتباطی</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[52px] mt-3 gap-2 md:gap-3">
        {items.map(({ id, icon: Icon, label, href, ariaLabel }) => (
          <div key={id} className="flex items-center justify-center gap-x-3 rounded-xl border border-neutral-100 truncate">
            <Icon size={20} color="#3D3D3D" className="shrink-0" />
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-850 truncate" aria-label={ariaLabel}>
              {label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
