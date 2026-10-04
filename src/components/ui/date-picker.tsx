import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_SHORT = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleDateString("en-GB", { month: "short" }));
/** The year grid shows this many years at a time. */
const YEARS_PER_PAGE = 12;

/** "2026-11-05" -> a local-time Date (not UTC, so the calendar day never shifts with the timezone). */
function parseDay(value: string | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** A local-time Date -> "2026-11-05". */
export function toDayString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && toDayString(a) === toDayString(b);

type Mode = "days" | "months" | "years";

interface DatePickerProps {
  /** "YYYY-MM-DD", or "" for no date. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest / latest pickable day, "YYYY-MM-DD". Days, months and years wholly outside are shown disabled. */
  min?: string;
  max?: string;
  placeholder?: string;
  /** Shows a Clear button in the footer. */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * A single-date picker in the app's own look: a field that opens a month grid. Click the month title to jump to a
 * month, then its year to jump to a year; the arrows step by month, year or page of years to match. Built from
 * plain buttons on the Popover primitive (no native date input and no Radix Select, which closes a Popover it
 * sits in). The keyboard moves between days with the arrow keys, Home and End, PageUp / PageDown change the
 * month, and Enter or Space picks. Days outside `min` / `max` cannot be picked.
 */
export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "Pick a date",
  clearable = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const selected = parseDay(value);
  const minDay = parseDay(min);
  const maxDay = parseDay(max);
  const today = startOfDay(new Date());

  const clamp = (d: Date) => (minDay && d < minDay ? minDay : maxDay && d > maxDay ? maxDay : d);
  const isDisabled = (d: Date) => (!!minDay && d < minDay) || (!!maxDay && d > maxDay);
  // A month / year is unavailable only when every day in it is outside the range.
  const monthUnavailable = (year: number, month: number) =>
    (!!minDay && new Date(year, month + 1, 0) < minDay) || (!!maxDay && new Date(year, month, 1) > maxDay);
  const yearUnavailable = (year: number) =>
    (!!minDay && new Date(year, 11, 31) < minDay) || (!!maxDay && new Date(year, 0, 1) > maxDay);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("days");
  const [view, setView] = useState<Date>(() => startOfMonth(selected ?? clamp(today)));
  const [yearPage, setYearPage] = useState(0);
  const [focusDay, setFocusDay] = useState<Date>(() => selected ?? clamp(today));
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  const pageStartFor = (year: number) => year - (year % YEARS_PER_PAGE);

  // Switching grids unmounts whatever was just clicked. If that element held focus, the browser drops focus to the
  // page and the surrounding sheet reads it as the user leaving, so everything closes. A mouse press on a month or
  // year cell therefore never takes focus (see `onMouseDown` below), and for the keyboard path focus is handed to
  // the title button, which never unmounts, before the grid changes.
  const goMode = (next: Mode) => {
    if (document.activeElement !== titleRef.current) titleRef.current?.focus();
    setMode(next);
  };

  // Each time it opens, start on the chosen day (or today, kept inside the allowed range), showing days.
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      const start = selected ?? clamp(today);
      setMode("days");
      setView(startOfMonth(start));
      setFocusDay(start);
    }
  };

  // After a keyboard move, put real focus on the new day's button.
  useEffect(() => {
    if (!open || mode !== "days" || !moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${toDayString(focusDay)}"]`)?.focus();
  }, [focusDay, view, open, mode]);

  const weeks = useMemo(() => {
    const first = startOfMonth(view);
    const cells: (Date | null)[] = Array.from({ length: first.getDay() }, () => null);
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= days; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  }, [view]);

  const pageStart = pageStartFor(view.getFullYear()) + yearPage * YEARS_PER_PAGE;

  // Arrow availability depends on what the current grid steps by.
  const canGoPrev =
    mode === "days"
      ? !minDay || addDays(startOfMonth(view), -1) >= minDay
      : mode === "months"
        ? !minDay || view.getFullYear() - 1 >= minDay.getFullYear()
        : !minDay || pageStart - 1 >= minDay.getFullYear();
  const canGoNext =
    mode === "days"
      ? !maxDay || addMonths(view, 1) <= maxDay
      : mode === "months"
        ? !maxDay || view.getFullYear() + 1 <= maxDay.getFullYear()
        : !maxDay || pageStart + YEARS_PER_PAGE <= maxDay.getFullYear();

  const step = (direction: 1 | -1) => {
    if (mode === "days") setView(addMonths(view, direction));
    else if (mode === "months") setView(new Date(view.getFullYear() + direction, view.getMonth(), 1));
    else setYearPage(yearPage + direction);
  };

  const pick = (day: Date) => {
    if (isDisabled(day)) return;
    onChange(toDayString(day));
    setOpen(false);
  };

  const moveTo = (day: Date) => {
    const target = clamp(day);
    moveFocus.current = true;
    setFocusDay(target);
    setView(startOfMonth(target));
  };

  const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDay, -1),
      ArrowRight: () => addDays(focusDay, 1),
      ArrowUp: () => addDays(focusDay, -7),
      ArrowDown: () => addDays(focusDay, 7),
      Home: () => addDays(focusDay, -focusDay.getDay()),
      End: () => addDays(focusDay, 6 - focusDay.getDay()),
      PageUp: () => new Date(focusDay.getFullYear(), focusDay.getMonth() - 1, focusDay.getDate()),
      PageDown: () => new Date(focusDay.getFullYear(), focusDay.getMonth() + 1, focusDay.getDate()),
    };
    const next = keys[e.key];
    if (!next) return;
    e.preventDefault();
    moveTo(next());
  };

  const titleButtonClass =
    "flex items-center gap-1 rounded-control px-2 py-1 text-[12.5px] font-semibold text-ink transition-colors hover:bg-paper-2";
  const arrowClass =
    "flex size-7 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30";
  const cellClass = (active: boolean, unavailable: boolean) =>
    cn(
      "flex h-9 items-center justify-center rounded-control text-[12px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ultra/60",
      active ? "bg-ultra font-semibold text-paper" : "text-ink hover:bg-paper-2",
      unavailable && "pointer-events-none opacity-30"
    );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-panel border border-border bg-paper-2 px-2.5 text-left text-[12.5px] outline-none transition-colors",
            "hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            selected ? "text-ink" : "text-ink-4",
            className
          )}
        >
          <span className="truncate">
            {selected
              ? selected.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
              : placeholder}
          </span>
          <CalendarDays className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[17.5rem] p-3" aria-label="Choose a date">
        <div className="flex items-center justify-between pb-2">
          <button type="button" aria-label="Previous" disabled={!canGoPrev} onClick={() => step(-1)} className={arrowClass}>
            <ChevronLeft className="size-4" />
          </button>

          <button
            ref={titleRef}
            type="button"
            onClick={() => {
              if (mode === "years") setYearPage(0);
              goMode(mode === "days" ? "months" : mode === "months" ? "years" : "days");
            }}
            aria-label={mode === "days" ? "Choose month and year" : mode === "months" ? "Choose year" : "Back to the month"}
            className={titleButtonClass}
          >
            <span aria-live="polite">
              {mode === "days"
                ? view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
                : mode === "months"
                  ? view.getFullYear()
                  : `${pageStart} – ${pageStart + YEARS_PER_PAGE - 1}`}
            </span>
            <ChevronDown className={cn("size-3.5 text-ink-3 transition-transform", mode !== "days" && "rotate-180")} />
          </button>

          <button type="button" aria-label="Next" disabled={!canGoNext} onClick={() => step(1)} className={arrowClass}>
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* The three grids stay mounted and are only hidden, so the cell that was just clicked is never removed from the
            page mid-click (removing it made the surrounding sheet treat the click as one outside it and close). */}
        {
          <div
            ref={gridRef}
            role="grid"
            hidden={mode !== "days"}
            onKeyDown={onGridKeyDown}
            aria-label={view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          >
            <div role="row" className="grid grid-cols-7 pb-1">
              {WEEKDAYS.map((d) => (
                <span key={d} role="columnheader" className="text-center font-mono text-[9.5px] text-ink-4">
                  {d}
                </span>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} role="row" className="grid grid-cols-7">
                {week.map((day, di) =>
                  day ? (
                    <button
                      key={di}
                      type="button"
                      role="gridcell"
                      data-day={toDayString(day)}
                      tabIndex={sameDay(day, focusDay) ? 0 : -1}
                      disabled={isDisabled(day)}
                      aria-selected={sameDay(day, selected)}
                      aria-label={day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      onClick={() => pick(day)}
                      className={cn(
                        "mx-auto flex size-8 items-center justify-center rounded-control text-[12px] transition-colors outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ultra/60",
                        sameDay(day, selected)
                          ? "bg-ultra font-semibold text-paper"
                          : "text-ink hover:bg-paper-2 disabled:pointer-events-none disabled:text-ink-4 disabled:opacity-40",
                        sameDay(day, today) && !sameDay(day, selected) && "font-semibold text-ultra ring-1 ring-ultra-border"
                      )}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <span key={di} className="size-8" aria-hidden />
                  )
                )}
              </div>
            ))}
          </div>
        }

        {
          <div role="group" hidden={mode !== "months"} aria-label={`Months of ${view.getFullYear()}`} className={cn("grid-cols-3 gap-1", mode === "months" ? "grid" : "hidden")}>
            {MONTH_SHORT.map((name, month) => (
              <button
                key={name}
                type="button"
                disabled={monthUnavailable(view.getFullYear(), month)}
                onMouseDown={(e) => e.preventDefault()}
                aria-pressed={!!selected && selected.getFullYear() === view.getFullYear() && selected.getMonth() === month}
                onClick={() => {
                  const target = clamp(new Date(view.getFullYear(), month, Math.min(focusDay.getDate(), 28)));
                  setView(startOfMonth(target));
                  setFocusDay(target);
                  goMode("days");
                }}
                className={cellClass(
                  !!selected && selected.getFullYear() === view.getFullYear() && selected.getMonth() === month,
                  monthUnavailable(view.getFullYear(), month)
                )}
              >
                {name}
              </button>
            ))}
          </div>
        }

        {
          <div role="group" hidden={mode !== "years"} aria-label="Years" className={cn("grid-cols-3 gap-1", mode === "years" ? "grid" : "hidden")}>
            {Array.from({ length: YEARS_PER_PAGE }, (_, i) => pageStart + i).map((year) => (
              <button
                key={year}
                type="button"
                disabled={yearUnavailable(year)}
                onMouseDown={(e) => e.preventDefault()}
                aria-pressed={selected?.getFullYear() === year}
                onClick={() => {
                  setView(new Date(year, view.getMonth(), 1));
                  goMode("months");
                }}
                className={cn(cellClass(selected?.getFullYear() === year, yearUnavailable(year)), year === today.getFullYear() && selected?.getFullYear() !== year && "font-semibold text-ultra")}
              >
                {year}
              </button>
            ))}
          </div>
        }

        <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
          {clearable ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-[11.5px] font-medium text-ultra hover:underline"
            >
              Clear
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={isDisabled(today)}
            onClick={() => pick(today)}
            className="text-[11.5px] font-medium text-ultra hover:underline disabled:pointer-events-none disabled:text-ink-4 disabled:no-underline"
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
