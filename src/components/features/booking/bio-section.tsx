import { useCallback, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

// 🎨 Types
interface BioSectionProps {
  bio: string;
  title: string;
  className?: string;
}

// 📋 BioSection: Displays a collapsible biography section
const BioSection = ({ bio, title, className }:BioSectionProps) => {
  // 🔐 State: manages expanded/collapsed state
  const [isExpanded, setIsExpanded] = useState(true);

  // 🎯 Toggle handler — memoized for performance
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className={clsx(
      'p-3 sm:px-4 lg:p-5 border border-neutral-100 md:border-none md:rounded-none rounded-[10px] relative',
      className
    )}>
      {/* 🏷️ Section header */}
      <h4 className="text-lg text-black font-medium">
        درباره {title}
      </h4>

      {/* 📝 Expandable content with fixed height animation */}
      <div className={clsx("transition-all duration-400 ease-in-out overflow-hidden",isExpanded ? "h-16.25" : "h-31.25  xl:h-27.75")}>
        <p className="text-neutral-700 text-[13px] mt-2  line-clamp-6">
          {bio}
        </p>
      </div>

      {/* 🌫️ Gradient overlay — visually hides overflow text when collapsed */}
      <div
        className={clsx(
          'absolute bottom-0 z-10 left-0 right-0 h-18.75 rounded-b-[10px] bg-linear-to-t from-white to-transparent pointer-events-none transition-opacity duration-300',
          isExpanded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* 🔄 Toggle button — accessible, centered, with rotation effect */}
      <Button
        onClick={toggleExpand}
        variant="ghost"
        size="icon"
        className="absolute -bottom-5 left-0 right-0 m-auto w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center z-40 p-0"
        aria-expanded={!isExpanded}
        aria-label={isExpanded ? "مشاهده بیشتر" : "مشاهده کمتر"}
      >
        <IoIosArrowDown
          size={24}
          color="#6D6D6D"
          className={clsx(
            'transition-transform duration-300 ease-in-out',
            !isExpanded && 'rotate-180' // Rotates arrow when collapsed
          )}
        />
      </Button>
    </div>
  );
};

export default BioSection;
