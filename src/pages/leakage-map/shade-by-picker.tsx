import * as React from "react";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SHADE_BY_FOOTNOTE, SHADE_BY_OPTIONS } from "@/pages/leakage-map/data";

interface ShadeByPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatThrough(date: Date) {
  const currentYear = new Date().getFullYear();
  return `Through ${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== currentYear ? "numeric" : undefined,
  })}`;
}

/**
 * Popover-based, matching WindowPicker on the same page — see
 * [[select_popover_aria_hidden_bug]] for why a plain `Select` can't sit next to it. The preset
 * list now also carries WindowPicker's forward-phrased periods (see data.ts), so "Custom date…"
 * reuses its list/calendar split — but as a single future date rather than a from/to span, since
 * a forward exposure window always starts today.
 */
export function ShadeByPicker({ value, onChange }: ShadeByPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"list" | "calendar">("list");
  const [customDate, setCustomDate] = React.useState<Date | null>(null);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [calendarMonth, setCalendarMonth] = React.useState(today);

  const selected = SHADE_BY_OPTIONS.find((option) => option.value === value) ?? SHADE_BY_OPTIONS[0];
  const shortLabel = value === "custom" && customDate ? formatThrough(customDate) : selected.shortLabel;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setView("list");
  };

  const openCustomView = () => {
    setCalendarMonth(startOfDay(customDate ?? today));
    setView("calendar");
  };

  const handleSelectDate = (date: Date) => {
    setCustomDate(date);
    onChange("custom");
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-auto items-center gap-2 rounded-panel border border-border bg-background px-2.5 py-2 text-[13px] whitespace-nowrap text-ink outline-none transition-colors hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span>
            <span className="text-ink-3">View </span>
            <span>{shortLabel}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className={view === "list" ? "w-72 p-1" : "w-[296px] p-3"}>
        {view === "list" ? (
          <>
            {SHADE_BY_OPTIONS.map((option) => {
              if (option.value === "custom") {
                const isActive = value === "custom" && !!customDate;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={openCustomView}
                    className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                  >
                    <span className="block flex-1">
                      <span className="block text-[12px] font-medium text-ink">
                        {isActive ? formatThrough(customDate!) : option.label}
                      </span>
                      <span className="block text-[10.5px] text-ink-3">
                        {isActive ? "tap to change the date" : option.note}
                      </span>
                    </span>
                    {isActive && <Check className="size-3.5 shrink-0 text-ultra" />}
                  </button>
                );
              }
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                >
                  <span className="block flex-1">
                    <span className="block text-[12px] font-medium text-ink">{option.label}</span>
                    <span className="block text-[10.5px] text-ink-3">{option.note}</span>
                  </span>
                  {option.value === value && <Check className="size-3.5 shrink-0 text-ultra" />}
                </button>
              );
            })}
            <div className="mt-1 border-t border-line px-2.5 pt-2 text-[10.5px] leading-relaxed text-ink-4">
              {SHADE_BY_FOOTNOTE}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2.5 flex items-center gap-1">
              <button
                type="button"
                aria-label="Back to view options"
                onClick={() => setView("list")}
                className="flex size-6 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <p className="text-[12px] font-medium text-ink">Custom date</p>
            </div>

            <p className="mb-3 text-[10.5px] text-ink-3">
              Exposure runs from today through the date you pick.
            </p>

            <Calendar
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              from={today}
              to={customDate}
              onSelectDate={handleSelectDate}
              minDate={today}
            />
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
