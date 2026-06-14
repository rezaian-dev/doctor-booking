import type { LucideIcon } from "lucide-react";
import { SOCIAL_LINKS, type ContactItem } from "@/lib/constants/footer-data";
import { cn } from "@/lib/utils/cn";

// ☎️ Phone-number list with a leading icon — one source for both footers: "stacked"
//    (desktop, centered column) and "inline" (mobile, icon beside the links).
export function FooterContactList({
  items,
  Icon,
  layout,
}: {
  items: readonly ContactItem[];
  Icon: LucideIcon;
  layout: "stacked" | "inline";
}) {
  const links = items.map(({ link, number }) => (
    <a
      key={link}
      href={link}
      dir="ltr"
      className={cn(
        "text-neutral-850 text-sm",
        layout === "stacked" && "hover:text-primary-500 transition-colors duration-200",
      )}
    >
      {number}
    </a>
  ));

  if (layout === "stacked") {
    return (
      <div className="flex flex-col items-center justify-center gap-y-2">
        <Icon size={24} color="#3D3D3D" aria-hidden="true" />
        {links}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Icon size={24} color="#3D3D3D" aria-hidden="true" />
      <div className="flex flex-col gap-y-2">{links}</div>
    </div>
  );
}

// ⚖️ Legal info block — identical across both footers
export function FooterLegalInfo() {
  return (
    <div>
      <h4 className="text-neutral-850 font-bold text-base mb-4">اطلاعات حقوقی</h4>
      <ul className="flex flex-col gap-y-3">
        <li className="text-sm text-neutral-850">تمامی حقوق محفوظ است.</li>
        <li className="text-sm text-neutral-850">سال تأسیس: 2025</li>
      </ul>
    </div>
  );
}

// 🌐 Social icon row — same markup in both footers, only the icon size differs.
//    Renders nothing when no links are configured (env-driven) → no empty box. ✨
export function FooterSocialRow({ iconSize }: { iconSize: number }) {
  if (SOCIAL_LINKS.length === 0) return null;
  return (
    <div className="flex items-center gap-x-3">
      {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          aria-label={label}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full p-1.5 hover:bg-gray-100 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={iconSize} color="#141B34" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
