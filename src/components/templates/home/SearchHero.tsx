import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';

const SearchHero: React.FC = () => {
  return (
    <section className="container px-4 md:px-8 mt-3.5 md:my-[30px]">
      <div
        className="w-full h-[300px] rounded-2xl overflow-hidden
    bg-[linear-gradient(rgba(17,17,17,0.4),rgba(17,17,17,0.4)),url('/images/Search-box.png')] flex justify-center flex-col items-center gap-y-4 md:gap-y-6 bg-cover bg-center bg-no-repeat px-4 md:px-0"
      >
        <h2 className="font-medium text-xl md:text-[32px] text-center drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)] text-white">
          فقط یک جستجو با بهترین پزشکان فاصله دارید
        </h2>
        <h3 className="font-normal md:font-medium text-sm md:text-xl text-neutral-30 drop-shadow-[0_3px_2px_rgba(0,0,0,0.25)]">
          در کمتر از ۱ دقیقه نوبت خود را رزرو کنید
        </h3>
        <div className="bg-white h-14 flex items-center gap-x-2 w-full max-w-[616px] rounded-2xl px-4 py-2">
          <input
            dir="rtl"
            lang="fa"
            className="text-[11px] sm:text-sm text-black text-ellipsis placeholder:text-neutral-400 w-full h-full outline-none"
            type="text"
            placeholder="پزشک یا تخصص مورد نظر خود را جستجو کنید..."
          />
          <HugeiconsIcon icon={Search01Icon} color='#b3b3b3' className='cursor-pointer hover:text-black transition-all' />
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
