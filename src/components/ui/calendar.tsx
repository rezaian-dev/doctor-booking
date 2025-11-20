import {ComponentProps, useEffect, useRef} from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayButton, getDefaultClassNames, DayPicker } from 'react-day-picker';
import { toJalaali } from 'jalaali-js';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

// 📅 Constants
const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'] as const;
const WEEKDAYS: Record<string, string> = { Saturday: 'شنبه', Sunday: 'یکشنبه', Monday: 'دوشنبه', Tuesday: 'سه‌شنبه', Wednesday: 'چهارشنبه', Thursday: 'پنجشنبه', Friday: 'جمعه' };
const toPersian = (n: number) => n.toLocaleString("fa-IR",{useGrouping:false});

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  weekStartsOn = 6,
  ...props
}: ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>['variant'];
  weekStartsOn?: number;
}) {
  const base = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      weekStartsOn={weekStartsOn}
      className={cn('w-full rounded-xl bg-white [&_tbody]:rounded-2xl [&_tbody]:bg-gray-100 [&_tbody]:p-1 [&_tbody]:block [&_tbody]:h-52 [&_tbody]:overflow-hidden', className)}
      formatters={{
        formatMonthCaption: (d: Date) => {
          const { jy, jm } = toJalaali(d);
          return `${JALALI_MONTHS[jm - 1]} ماه ${toPersian(jy)}`;
        },
        ...formatters
      }}
      classNames={{
        root: cn('w-full', base.root),
        months: cn('flex flex-col gap-y-3 relative', base.months),
        month: cn('flex flex-col gap-y-3', base.month),
        nav: cn('flex justify-between items-center absolute top-0 inset-x-0 px-3', base.nav),
        button_previous: cn(buttonVariants({ variant: buttonVariant }), 'size-6 md:size-8 p-0 rounded-full bg-primary-50 text-primary-500 hover:bg-primary-50 hover:text-primary-500 transition-colors', base.button_previous),
        button_next: cn(buttonVariants({ variant: buttonVariant }), 'size-6 md:size-8 p-0 rounded-full bg-primary-50 text-primary-500 hover:bg-primary-50 hover:text-primary-500 transition-colors', base.button_next),
        month_caption: cn('flex items-center justify-center h-10', base.month_caption),
        caption_label: cn('text-sm md:text-base font-bold text-gray-900', base.caption_label),
        weekdays: cn('flex justify-between h-7 mb-3 px-1 xs:px-3 lg:px-1 rounded-[25px] gap-x-1 xs:gap-x-3 font-medium bg-gray-100'),
        weekday: cn('flex w-6 h-6 rounded-full font-medium text-gray-600', base.weekday),
        week: cn('flex w-full p-1 md:px-7 lg:px-2 items-center justify-between h-10', base.week),
        day: cn('flex w-6 h-6 rounded-full items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-black text-[11px] xs:text-sm font-medium',base.day),
        today: cn('font-bold text-xs text-secondary-500', base.today),
        selected:cn("bg-primary-500 text-white hover:bg-primary-500 hover:text-white",base.selected),
        outside:cn("text-danger-950",base.outside),
        disabled:cn("'text-white opacity-40 cursor-not-allowed",base.disabled),
        hidden: cn('invisible', base.hidden),
        ...classNames
      }}
      components={{
        Chevron: ({ orientation, className }) => {
          const Icon = orientation === 'left' ? ChevronRightIcon : orientation === 'right' ? ChevronLeftIcon : ChevronDownIcon;
          return <Icon className={cn('size-4 md:size-6', className)} />;
        },
        DayButton: CalendarDayButton,
        Weekday: (props: any) => (
          <th {...props} className={cn('flex md:flex-1 items-center justify-center w-6 h-6', props.className)}>
            <span className="text-[10px] xs:text-xs xs:font-medium text-neutral-700">{WEEKDAYS[props['aria-label']]}</span>
          </th>
        ),
        ...components
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }:ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (modifiers.focused) ref.current?.focus(); }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      className={cn("w-6 h-6 cursor-pointer rounded-full",
        modifiers.outside && "text-neutral-200" ,
        modifiers.today && !modifiers.selected && 'font-bold text-neutral-500',


      )}
      {...props}
    >
      {toPersian(toJalaali(day.date).jd)}
    </button>
  );
}

export { Calendar, CalendarDayButton };
