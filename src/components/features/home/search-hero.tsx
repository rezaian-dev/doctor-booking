"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// 🗂️ Static suggestion list — specialty labels for instant client-side filtering
const SUGGESTIONS = [
  "پزشک عمومی", "قلب و عروق", "پوست، مو و زیبایی", "کودکان (اطفال)",
  "زنان و زایمان", "مغز و اعصاب", "ارتوپدی", "چشم‌پزشکی",
  "دندانپزشکی عمومی", "روانپزشکی", "گوش، حلق و بینی", "داخلی",
  "گوارش و کبد", "غدد و متابولیسم", "اورولوژی", "جراحی عمومی",
  "روانشناسی", "فیزیوتراپی",
];

// ✨ Smart search box: suggestions + keyboard nav + animated dropdown
const SearchHero = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false); // 👉 user intent to show the dropdown

  // 🔍 Suggestions derived from the query during render — no effect, no cascading setState 🧠
  const filtered = useMemo(() => {
    const q = query.trim();
    return q ? SUGGESTIONS.filter((s) => s.includes(q)).slice(0, 6) : [];
  }, [query]);

  // 👁️ Show the dropdown only when the user wants it open AND there are matches
  const showDropdown = open && filtered.length > 0;

  // 🖱️ Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🚀 Navigate to /doctors with the search query param
  const navigate = useCallback((term: string) => {
    if (!term.trim()) return;
    setOpen(false);
    router.push(`/doctors?search=${encodeURIComponent(term.trim())}`);
  }, [router]);

  // ⌨️ Keyboard: ArrowUp / ArrowDown / Enter / Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) { if (e.key === "Enter") navigate(query); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") { e.preventDefault(); navigate(activeIdx >= 0 ? filtered[activeIdx]! : query); }
    else if (e.key === "Escape") { setOpen(false); setActiveIdx(-1); }
  };

  return (
    <section className="container px-4 md:px-8 mt-3.5 md:mt-7.5">
      {/* 🖼️ Background image hero wrapper */}
      <div className="w-full h-75 overflow-visible rounded-2xl bg-cover bg-center bg-no-repeat
        bg-[linear-gradient(rgba(17,17,17,0.4),rgba(17,17,17,0.4)),url(/images/search-box.png)]
        flex flex-col items-center justify-center gap-y-4 md:gap-y-6 px-4 md:px-0">

        {/* 📣 Headline */}
        <h2
          className="font-medium text-center text-white drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)] text-xl md:text-[32px]"
          data-aos="fade-down"
          suppressHydrationWarning
        >
          فقط یک جستجو با بهترین پزشکان فاصله دارید
        </h2>

        {/* 📝 Subheading */}
        <h3
          className="font-normal md:font-medium text-center text-neutral-100 drop-shadow-[0_3px_2px_rgba(0,0,0,0.45)] text-sm md:text-xl"
          data-aos="fade-up"
          data-aos-delay="100"
          suppressHydrationWarning
        >
          در کمتر از ۱ دقیقه نوبت خود را رزرو کنید
        </h3>

        {/* 🔍 Input + dropdown container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-154"
          data-aos="zoom-in"
          data-aos-delay="200"
          suppressHydrationWarning
        >
          {/* Input row */}
          <div className={cn(
            "bg-white w-full h-14 rounded-2xl px-4 py-2 flex items-center gap-x-2",
            showDropdown && "rounded-b-none" // 🔗 visually connect input to dropdown
          )}>
            <input
              ref={inputRef}
              type="text"
              dir="rtl"
              lang="fa"
              role="combobox"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1); }}
              onKeyDown={handleKeyDown}
              placeholder="پزشک یا تخصص مورد نظر خود را جستجو کنید..."
              className="w-full h-full outline-none text-[11px] sm:text-sm text-black placeholder:text-neutral-600 truncate"
              aria-label="جستجوی پزشک یا تخصص"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showDropdown}
              autoComplete="off"
            />
            {/* ✖ Clear */}
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
                className="text-neutral-600 hover:text-danger-500 transition-colors"
                aria-label="پاک کردن جستجو"
              >
                <X size={16} />
              </button>
            )}
            {/* 🔎 Search */}
            <button
              type="button"
              onClick={() => navigate(query)}
              className="text-neutral-600 hover:text-primary-600 transition-colors"
              aria-label="جستجو"
            >
              <Search size={24} />
            </button>
          </div>

          {/* 📋 Animated suggestions dropdown */}
          {showDropdown && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute top-full right-0 left-0 z-50 bg-white rounded-b-2xl
                border border-t-0 border-neutral-200 shadow-lg overflow-hidden
                animate-in slide-in-from-top-1 fade-in duration-200"
            >
              {filtered.map((item, idx) => (
                <li
                  key={item}
                  role="option"
                  aria-selected={idx === activeIdx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => navigate(item)}
                  className={cn(
                    "flex items-center gap-x-3 px-4 py-2.5 cursor-pointer",
                    "text-sm text-neutral-700 transition-colors duration-100",
                    idx === activeIdx ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                  )}
                >
                  <Search size={14} className="text-neutral-600 shrink-0" />
                  <span dir="rtl">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
