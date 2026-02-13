'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';

interface PersianDatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  disabled?: boolean;
}

export function PersianDatePicker({ value, onChange, disabled = false }: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 🗓️ Parse Persian date
  const parsePersianDate = (dateStr?: string) => {
    if (!dateStr) return { year: 1380, month: 1, day: 1 };
    const [year, month, day] = dateStr.split('/').map(Number);
    return { year: year || 1380, month: month || 1, day: day || 1 };
  };

  const { year, month, day } = parsePersianDate(value);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedDay, setSelectedDay] = useState(day);

  // 📅 Persian month names
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
  ];

  // 📊 Days in month
  const getDaysInMonth = (m: number) => (m <= 6 ? 31 : m <= 11 ? 30 : 29);

  // ✅ Handle date selection
  const handleDateSelect = (d: number) => {
    setSelectedDay(d);
    const formattedDate = `${selectedYear}/${String(selectedMonth).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
    onChange?.(formattedDate);
    setIsOpen(false);
  };

  // 🔄 Handle month change
  const handleMonthChange = (newMonth: string) => {
    const monthNum = Number(newMonth);
    setSelectedMonth(monthNum);
    const maxDays = getDaysInMonth(monthNum);
    if (selectedDay > maxDays) setSelectedDay(maxDays);
  };

  // 🎨 Display value
  const displayValue = value
    ? `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
    : 'انتخاب تاریخ';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-right font-normal border-neutral-200 hover:border-primary-300',
            !value && 'text-neutral-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <CalendarIcon className={cn('ml-2 h-4 w-4', value ? 'text-primary-500' : 'text-neutral-400')} />
          {displayValue}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 border-neutral-200 shadow-lg" align="start">
        <div className="p-4 space-y-4 bg-white rounded-lg">
          {/* 📆 Year & Month */}
          <div className="flex gap-2">
            <Select value={String(selectedYear)} onValueChange={val => setSelectedYear(Number(val))}>
              <SelectTrigger className="flex-1 border-neutral-200">
                <SelectValue placeholder="سال" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 100 }, (_, i) => 1400 - i).map(y => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(selectedMonth)} onValueChange={handleMonthChange}>
              <SelectTrigger className="flex-1 border-neutral-200">
                <SelectValue placeholder="ماه" />
              </SelectTrigger>
              <SelectContent>
                {persianMonths.map((m, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🗓️ Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map(d => (
              <Button
                key={d}
                type="button"
                variant={d === selectedDay ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateSelect(d)}
                className={cn(
                  'h-9 w-9 p-0 font-normal transition-all',
                  d === selectedDay
                    ? 'bg-primary-500 text-white hover:bg-primary-600 font-semibold'
                    : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                )}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
