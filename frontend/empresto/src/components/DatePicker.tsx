import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface DatePickerProps {
  value: string;
  onChange: (isoDate: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function parseDate(val: string): { year: number; month: number; day: number } | null {
  if (!val) return null;
  const clean = val.trim();
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return { year: y, month: m, day: d };
    }
  }
  const parts = clean.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return { year: y, month: m, day: d };
  }
  return null;
}

function toIsoString(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toDisplayString(year: number, month: number, day: number): string {
  const d = String(day).padStart(2, '0');
  const m = String(month + 1).padStart(2, '0');
  const y = String(year);
  return `${d}/${m}/${y}`;
}

export default function DatePicker({
  value,
  onChange,
  disabled = false,
  error,
  placeholder = 'DD/MM/AAAA',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDate(value);
  const today = new Date();

  const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.year : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.month : today.getMonth());

  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.year);
      setViewMonth(selectedDate.month);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    onChange(toIsoString(year, month, day));
    setIsOpen(false);
  };

  const handleQuickAddDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    onChange(toIsoString(d.getFullYear(), d.getMonth(), d.getDate()));
    setIsOpen(false);
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonthDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  const currentMonthDays = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    currentMonthDays.push(d);
  }

  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays = [];
  for (let d = 1; d <= nextMonthDaysCount; d++) {
    nextMonthDays.push(d);
  }

  const isToday = (day: number) => {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate !== null &&
      selectedDate.year === viewYear &&
      selectedDate.month === viewMonth &&
      selectedDate.day === day
    );
  };

  const displayValue = selectedDate
    ? toDisplayString(selectedDate.year, selectedDate.month, selectedDate.day)
    : '';

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-3 py-2.5 bg-gray-100/80 rounded-xl text-xs text-gray-800 outline-none flex items-center justify-between transition-all ${
          error
            ? 'border border-red-500 bg-red-50/30'
            : disabled
            ? 'cursor-not-allowed opacity-80'
            : isOpen
            ? 'bg-white ring-2 ring-emerald-800'
            : 'hover:bg-gray-200/70 cursor-pointer'
        }`}
      >
        <span className={displayValue ? 'text-gray-800 font-medium' : 'text-gray-400'}>
          {displayValue || placeholder}
        </span>
        <Icon icon="lucide:calendar" className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 p-4 w-72 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <Icon icon="lucide:chevron-left" className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gray-800 font-jakarta capitalize">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <Icon icon="lucide:chevron-right" className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-3 pb-1">
            {WEEKDAY_NAMES.map((name, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold text-gray-400 text-center uppercase py-0.5"
              >
                {name[0]}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 pt-1">
            {prevMonthDays.map((day) => (
              <button
                key={`prev-${day}`}
                type="button"
                onClick={() => {
                  const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
                  const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
                  handleSelectDay(prevYear, prevMonth, day);
                }}
                className="w-8 h-8 rounded-xl text-xs text-gray-300 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                {day}
              </button>
            ))}

            {currentMonthDays.map((day) => {
              const selected = isSelected(day);
              const todayDay = isToday(day);

              return (
                <button
                  key={`curr-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(viewYear, viewMonth, day)}
                  className={`w-8 h-8 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${
                    selected
                      ? 'bg-emerald-900 text-white font-bold shadow-xs'
                      : todayDay
                      ? 'ring-1 ring-emerald-700 font-semibold text-emerald-900 hover:bg-emerald-50'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {nextMonthDays.map((day) => (
              <button
                key={`next-${day}`}
                type="button"
                onClick={() => {
                  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
                  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
                  handleSelectDay(nextYear, nextMonth, day);
                }}
                className="w-8 h-8 rounded-xl text-xs text-gray-300 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                {day}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => handleQuickAddDays(0)}
              className="px-2 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 text-gray-600 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddDays(7)}
              className="px-2 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 text-gray-600 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            >
              +7 dias
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddDays(14)}
              className="px-2 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 text-gray-600 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            >
              +14 dias
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddDays(30)}
              className="px-2 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 text-gray-600 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            >
              +30 dias
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
