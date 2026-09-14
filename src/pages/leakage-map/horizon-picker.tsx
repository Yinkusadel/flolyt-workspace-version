import * as React from "react";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  HORIZON_CUSTOM_LABEL,
  HORIZON_FOOTNOTE,
  HORIZON_GROUPS,
  type HorizonValue,
} from "@/pages/leakage-map/data";

export type HorizonState =
  | { kind: "preset"; value: HorizonValue; direction: "back" | "forward" }
  | { kind: "custom"; from: Date; to: Date };

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatRange(from: Date, to: Date) {
  const currentYear = new Date().getFullYear();
  const fromLabel = from.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const toLabel = to.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: to.getFullYear() !== currentYear ? "numeric" : undefined,
  });
  return `${fromLabel} – ${toLabel}`;
}

export function horizonLabel(state: HorizonState): string {
  if (state.kind === "custom") return formatRange(state.from, state.to);
  for (const group of HORIZON_GROUPS) {
    const match = group.options.find((o) => o.value === state.value && o.direction === state.direction);
    if (match) return match.label;
  }
  return "Next 90 days";
}

/**
 * One control for both directions the prior build kept separate (WindowPicker/ShadeByPicker) —
 * the export's own Horizon list is forward-only, so "Looking back" is grouped in above it and a
 * shared from/to range replaces the export's single forward date, letting Custom cover a past
 * span, a future one, or one straddling today. See data.ts's header note.
 */
export function HorizonPicker({
  value,
  onChange,
}: {
  value: HorizonState;
  onChange: (value: HorizonState) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"list" | "calendar">("list");

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [calendarMonth, setCalendarMonth] = React.useState(today);
  const [draftFrom, setDraftFrom] = React.useState<Date | null>(null);
  const [draftTo, setDraftTo] = React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const label = horizonLabel(value);

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
    setDraftFrom(value.kind === "custom" ? value.from : null);
    setDraftTo(value.kind === "custom" ? value.to : null);
    setCalendarMonth(startOfDay(value.kind === "custom" ? value.to : today));
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
    onChange({ kind: "custom", from: draftFrom, to: draftTo });
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
            <span className="text-ink-3">Horizon </span>
            <span>{label}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className={view === "list" ? "w-72 p-1" : "w-[296px] p-3"}>
        {view === "list" ? (
          <>
            {HORIZON_GROUPS.map((group) => (
              <div key={group.heading} className="mb-1 last:mb-0">
                <p className="px-2.5 pt-2 pb-1 font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                  {group.heading}
                </p>
                {group.options.map((option) => {
                  const isActive =
                    value.kind === "preset" && value.value === option.value && value.direction === option.direction;
                  return (
                    <button
                      key={`${option.direction}-${option.value}`}
                      type="button"
                      onClick={() => {
                        onChange({ kind: "preset", value: option.value, direction: option.direction });
                        handleOpenChange(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                    >
                      <span className="block flex-1">
                        <span className="block text-[12px] font-medium text-ink">{option.label}</span>
                        <span className="block text-[10.5px] text-ink-3">{option.note}</span>
                      </span>
                      {isActive && <Check className="size-3.5 shrink-0 text-ultra" />}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="mt-1 border-t border-line pt-1">
              {(() => {
                const isActive = value.kind === "custom";
                return (
                  <button
                    type="button"
                    onClick={openCustomView}
                    className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                  >
                    <span className="block flex-1">
                      <span className="block text-[12px] font-medium text-ink">
                        {isActive ? formatRange(value.from, value.to) : HORIZON_CUSTOM_LABEL}
                      </span>
                      <span className="block text-[10.5px] text-ink-3">
                        {isActive ? "tap to change the dates" : "pick any start and end, past or future"}
                      </span>
                    </span>
                    {isActive && <Check className="size-3.5 shrink-0 text-ultra" />}
                  </button>
                );
              })()}
            </div>

            <div className="mt-1 border-t border-line px-2.5 pt-2 text-[10.5px] leading-relaxed text-ink-4">
              {HORIZON_FOOTNOTE}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2.5 flex items-center gap-1">
              <button
                type="button"
                aria-label="Back to horizon options"
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
