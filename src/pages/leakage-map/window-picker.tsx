import * as React from "react";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DEFAULT_WINDOW, WINDOW_FOOTNOTE, WINDOW_OPTIONS } from "@/pages/leakage-map/data";

type CustomRange = { from: Date; to: Date };

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatRange(range: CustomRange) {
  const currentYear = new Date().getFullYear();
  const from = range.from.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const to = range.to.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: range.to.getFullYear() !== currentYear ? "numeric" : undefined,
  });
  return `${from} – ${to}`;
}

/**
 * Built as a Popover, not the plain `Select` the other Window options used to sit in — see
 * [[select_popover_aria_hidden_bug]]. Two views share one popover: the preset list, and (behind
 * "Custom range…") a single-month calendar for picking a from/to span. Selecting a range here only
 * changes this control's own label, same as every other Window option — see data.ts's header note,
 * there is no live endpoint behind this page yet for any window to recompute against.
 */
export function WindowPicker() {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"list" | "calendar">("list");
  const [value, setValue] = React.useState<string>(DEFAULT_WINDOW);
  const [customRange, setCustomRange] = React.useState<CustomRange | null>(null);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [calendarMonth, setCalendarMonth] = React.useState(today);
  const [draftFrom, setDraftFrom] = React.useState<Date | null>(null);
  const [draftTo, setDraftTo] = React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const selectedOption = WINDOW_OPTIONS.find((option) => option.value === value) ?? WINDOW_OPTIONS[0];
  const label = value === "custom" && customRange ? formatRange(customRange) : selectedOption.label;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setView("list");
      setDraftFrom(null);
      setDraftTo(null);
      setHoverDate(null);
    }
  };

  const openCustomView = () => {
    setDraftFrom(customRange?.from ?? null);
    setDraftTo(customRange?.to ?? null);
    setCalendarMonth(startOfDay(customRange?.to ?? today));
    setView("calendar");
  };

  const handleSelectDate = (date: Date) => {
    if (!draftFrom || draftTo) {
      setDraftFrom(date);
      setDraftTo(null);
      return;
    }
    if (date < draftFrom) {
      setDraftTo(draftFrom);
      setDraftFrom(date);
    } else {
      setDraftTo(date);
    }
  };

  const handleApply = () => {
    if (!draftFrom || !draftTo) return;
    setCustomRange({ from: draftFrom, to: draftTo });
    setValue("custom");
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
            <span className="text-ink-3">Window </span>
            <span>{label}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className={view === "list" ? "w-72 p-1" : "w-[296px] p-3"}>
        {view === "list" ? (
          <>
            {WINDOW_OPTIONS.map((option) => {
              if (option.value === "custom") {
                const isActive = value === "custom" && !!customRange;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={openCustomView}
                    className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                  >
                    <span className="block flex-1">
                      <span className="block text-[12px] font-medium text-ink">
                        {isActive ? formatRange(customRange!) : option.label}
                      </span>
                      <span className="block text-[10.5px] text-ink-3">
                        {isActive ? "tap to change the dates" : option.note}
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
                    setValue(option.value);
                    handleOpenChange(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                >
                  <span className="block flex-1">
                    <span className="block text-[12px] font-medium text-ink">{option.label}</span>
                    <span className={cn("block text-[10.5px]", option.caveat ? "text-amber" : "text-ink-3")}>
                      {option.note}
                    </span>
                  </span>
                  {value === option.value && <Check className="size-3.5 shrink-0 text-ultra" />}
                </button>
              );
            })}
            <div className="mt-1 border-t border-line px-2.5 pt-2 text-[10.5px] leading-relaxed text-ink-4">
              {WINDOW_FOOTNOTE}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2.5 flex items-center gap-1">
              <button
                type="button"
                aria-label="Back to window options"
                onClick={() => setView("list")}
                className="flex size-6 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <p className="text-[12px] font-medium text-ink">Custom range</p>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex-1 rounded-control border border-line bg-paper-2 px-2.5 py-1.5">
                <span className="block font-mono text-[8.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                  From
                </span>
                <span className={cn("block text-[11.5px]", draftFrom ? "text-ink" : "text-ink-4")}>
                  {draftFrom
                    ? draftFrom.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                    : "Select a date"}
                </span>
              </div>
              <div className="flex-1 rounded-control border border-line bg-paper-2 px-2.5 py-1.5">
                <span className="block font-mono text-[8.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                  To
                </span>
                <span className={cn("block text-[11.5px]", draftTo ? "text-ink" : "text-ink-4")}>
                  {draftTo
                    ? draftTo.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                    : "Select a date"}
                </span>
              </div>
            </div>

            <Calendar
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              from={draftFrom}
              to={draftTo}
              hoverDate={hoverDate}
              onHoverDate={setHoverDate}
              onSelectDate={handleSelectDate}
              maxDate={today}
            />

            <div className="mt-3 flex items-center justify-end gap-2 border-t border-line pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => setView("list")}>
                Cancel
              </Button>
              <Button type="button" size="sm" disabled={!draftFrom || !draftTo} onClick={handleApply}>
                Apply
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
