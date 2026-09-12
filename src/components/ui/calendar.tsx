import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString(undefined, { month: "long" })
);

// How many years back the Year dropdown offers below whatever year `maxDate` falls in.
const YEARS_BACK = 6;

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface CalendarProps {
  /** Any date within the month to display — only the year/month are read. */
  month: Date;
  onMonthChange: (month: Date) => void;
  from: Date | null;
  to: Date | null;
  /** Live cursor while a range's second date hasn't been picked yet, to preview the span. */
  hoverDate?: Date | null;
  onHoverDate?: (date: Date | null) => void;
  onSelectDate: (date: Date) => void;
  /** Dates after this are shown disabled — defaults to no limit. */
  maxDate?: Date;
  className?: string;
}

/**
 * Single-month range calendar with no date library dependency (none is installed in this repo).
 * Range highlighting reads `to ?? hoverDate` so hovering past a chosen start previews the span
 * before the second click commits it.
 */
export function Calendar({
  month,
  onMonthChange,
  from,
  to,
  hoverDate = null,
  onHoverDate,
  onSelectDate,
  maxDate,
  className,
}: CalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const nextMonthStart = new Date(year, monthIndex + 1, 1);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, monthIndex, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const rangeEnd = to ?? hoverDate;
  const rangeStart = from && rangeEnd ? (from < rangeEnd ? from : rangeEnd) : null;
  const rangeStop = from && rangeEnd ? (from < rangeEnd ? rangeEnd : from) : null;

  const maxYear = maxDate ? maxDate.getFullYear() : year;
  const yearOptions = Array.from({ length: YEARS_BACK + 1 }, (_, i) => maxYear - i);

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center justify-between gap-1 pb-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
          className="flex size-6 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        <div className="flex min-w-0 items-center gap-1">
          <select
            aria-label="Month"
            value={monthIndex}
            onChange={(e) => onMonthChange(new Date(year, Number(e.currentTarget.value), 1))}
            className="min-w-0 rounded-control border border-line bg-paper-2 px-1.5 py-1 text-[11px] font-medium text-ink"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i} disabled={year === maxYear && !!maxDate && i > maxDate.getMonth()}>
                {name}
              </option>
            ))}
          </select>
          <select
            aria-label="Year"
            value={year}
            onChange={(e) => onMonthChange(new Date(Number(e.currentTarget.value), monthIndex, 1))}
            className="min-w-0 rounded-control border border-line bg-paper-2 px-1.5 py-1 text-[11px] font-medium text-ink"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(nextMonthStart)}
          disabled={maxDate ? nextMonthStart > maxDate : false}
          className="flex size-6 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-6 items-center justify-center font-mono text-[9px] font-medium tracking-[0.4px] text-ink-4 uppercase"
          >
            {label}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) return <div key={i} className="h-7" />;

          const disabled = maxDate ? date > maxDate : false;
          const isFrom = !!from && isSameDay(date, from);
          const isTo = !!to && isSameDay(date, to);
          const isEndpoint = isFrom || isTo;
          const inRange = !isEndpoint && !!rangeStart && !!rangeStop && date > rangeStart && date < rangeStop;
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onMouseEnter={() => onHoverDate?.(date)}
              onMouseLeave={() => onHoverDate?.(null)}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex h-7 items-center justify-center rounded-control text-[11.5px] text-ink transition-colors",
                !disabled && !isEndpoint && "hover:bg-paper-2",
                inRange && "rounded-none bg-ultra-bg",
                isEndpoint && "bg-ultra font-medium text-paper",
                isToday && !isEndpoint && "font-semibold text-ultra",
                disabled && "cursor-not-allowed text-ink-4/50 hover:bg-transparent"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
