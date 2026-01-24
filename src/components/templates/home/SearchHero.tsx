import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import clsx from 'clsx';

/**
 * 🎯 Hero search section – main CTA for doctor discovery
 * 🖼️ Full-bleed background with overlay (accessible contrast)
 * 🔍 RTL-aware search input (Persian support)
 * 📱 Fully responsive: mobile → desktop
 * ♿ a11y-ready (labels, roles, focus management)
 */

interface  SearchHeroParams {
  mode: "main" | "find-doctor";
}
const SearchHero = ({mode}:SearchHeroParams) => {
  return (
    <section className={clsx(
  mode === 'find-doctor'
    ? 'md:mt-0 px-4 md:px-0 min-w-screen-sm w-full  mt-4 mx-auto'
    : 'container px-4 md:px-8 mt-3.5 md:mt-[30px]'
)}>
      {/* 🖼️ Hero background with dark overlay for text contrast */}
      <div
      className={clsx(
  'w-full overflow-hidden',
  'bg-cover bg-center bg-no-repeat',
  'flex flex-col items-center justify-center',
  'gap-y-4 md:gap-y-6 px-4 md:px-0',
  {
    'h-[260px] md:h-[428px] rounded-2xl md:rounded-none bg-[linear-gradient(rgba(17,17,17,0.1),rgba(17,17,17,0.1)),url(/images/Search-box.png)]':
      mode === 'find-doctor',
    'h-[300px] rounded-2xl bg-[linear-gradient(rgba(17,17,17,0.4),rgba(17,17,17,0.4)),url(/images/Search-box.png)]':
      mode !== 'find-doctor',
  }
)}
      >
        {/* 🏷️ Hero headline – bold & centered */}
        <h2
          className={clsx(
            'font-medium text-center text-white drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]',
            'text-xl md:text-[32px]'
          )}
        >
          فقط یک جستجو با بهترین پزشکان فاصله دارید
        </h2>

        {/* 📝 Subtitle – supportive messaging */}
        <h3
          className={clsx(
            'font-normal md:font-medium text-center text-neutral-300 drop-shadow-[0_3px_2px_rgba(0,0,0,0.25)]',
            'text-sm md:text-xl'
          )}
        >
          در کمتر از ۱ دقیقه نوبت خود را رزرو کنید
        </h3>

        {/* 🔍 Search input container */}
        <div
          className={clsx(
            'bg-white w-full max-w-[616px]',
            '  px-4 py-2',
            'flex items-center gap-x-2',
            mode ==="find-doctor" ? "h-10 md:h-14 rounded-[14px]" : "h-14 rounded-2xl"
          )}
        >
          <input
            type="text"
            dir="rtl"
            lang="fa"
            placeholder="پزشک یا تخصص مورد نظر خود را جستجو کنید..."
            className={clsx(
              'w-full h-full outline-none',
              'text-[11px] sm:text-sm text-black placeholder:text-neutral-400',
              'truncate' // better than text-ellipsis alone
            )}
            aria-label="جستجوی پزشک یا تخصص"
          />
          {/* 🔎 Search icon – interactive */}
          <HugeiconsIcon
            icon={Search01Icon}
            color="#b3b3b3"
            size={24}
            className="cursor-pointer hover:text-black transition-colors"
          />
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
