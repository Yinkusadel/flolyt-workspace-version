import * as React from "react";
import { Check, ChevronDown, ChevronLeft, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { LeakageMarketRailEntryDto } from "@/services/api/leakage/get-leakage";
import {
  CALCULATE_OPTIONS,
  CONFIDENCE_OPTIONS,
  SEVERITY_OPTIONS,
  daysBetween,
  horizonOptionLabel,
  marketOptionLabel,
  rangeSelectionLabel,
  startOfDay,
  windowOptionLabel,
  type LeakageFilterState,
  type LeakageRangeSelection,
} from "@/pages/leakage-map/filters";

function OptionRow({
  label,
  note,
  active,
  onClick,
}: {
  label: string;
  note?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
    >
      <span className="block flex-1">
        <span className="block text-[12px] font-medium text-ink">{label}</span>
        {note && <span className="block text-[10.5px] text-ink-3">{note}</span>}
      </span>
      {active && <Check className="size-3.5 shrink-0 text-ultra" />}
    </button>
  );
}

function SubHeading({ prefix, value }: { prefix: string; value: string }) {
  return (
    <span className="block flex-1 text-left">
      <span className="text-ink-3">{prefix} </span>
      <span className="text-ink">{value}</span>
    </span>
  );
}

/**
 * Manages one cascading level of the Filters menu: which key (if any) is "active" — i.e. open —
 * among a set of siblings, driven by both click (instant) and hover. Hover only takes over after
 * `openDelayMs` of dwelling on a trigger, and only lets go `closeDelayMs` after the pointer has
 * left both the trigger and its content.
 */
function useCascadeSlot<K extends string>(openDelayMs: number, closeDelayMs: number) {
  const [active, setActive] = React.useState<K | null>(null);
  const closeTimerRef = React.useRef<number | undefined>(undefined);
  const openTimerRef = React.useRef<number | undefined>(undefined);

  const clearClose = React.useCallback(() => {
    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);
  const clearOpen = React.useCallback(() => {
    if (openTimerRef.current !== undefined) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }, []);
  React.useEffect(() => {
    return () => {
      clearClose();
      clearOpen();
    };
  }, [clearClose, clearOpen]);

  const open = React.useCallback(
    (key: K) => {
      clearOpen();
      clearClose();
      setActive(key);
    },
    [clearOpen, clearClose],
  );

  const scheduleClose = React.useCallback(
    (key: K) => {
      clearClose();
      closeTimerRef.current = window.setTimeout(() => {
        setActive((current) => (current === key ? null : current));
      }, closeDelayMs);
    },
    [clearClose],
  );

  const closeAll = React.useCallback(() => {
    clearOpen();
    clearClose();
    setActive(null);
  }, [clearOpen, clearClose]);

  const handleEnter = React.useCallback(
    (key: K) => {
      if (active === key) {
        clearClose();
        return;
      }
      clearOpen();
      openTimerRef.current = window.setTimeout(() => open(key), openDelayMs);
    },
    [active, clearClose, clearOpen, open],
  );

  const handleLeave = React.useCallback(
    (key: K) => {
      clearOpen();
      scheduleClose(key);
    },
    [clearOpen, scheduleClose],
  );

  return { active, open, scheduleClose, closeAll, handleEnter, handleLeave, clearClose };
}

type TopKey = "calc" | "window" | "horizon" | "market" | "severity" | "confidence";
type RangeKind = "window" | "horizon";

/**
 * One filters trigger — an icon button that opens a list of categories (Calc, Window, Horizon,
 * Market, Severity, Confidence), each cascading its own options into a submenu beside it, same
 * interaction as a native OS menu. Window and Horizon are independent controls (the API always
 * takes both — window looks back, horizon looks forward) rather than the old single back/forward
 * toggle, each ending in its own "Custom…" entry.
 *
 * "Custom…" can't live as another nested DropdownMenuSub: Radix's Menu content, under this repo's
 * preact/compat setup, closes a submenu back to its parent on any inner click that doesn't itself
 * select-and-close (see [[preact_radix_dialog_crash]]). A free-form calendar click is exactly that
 * case, so picking "Custom…" closes this whole menu and opens a separate Popover (anchored to the
 * same trigger button) instead — same pattern the page used before. Unlike the old range picker,
 * the API takes only a day count, not a from/to pair, so the calendar here picks a single date
 * (the window's start, or the horizon's end) and converts it to a day count before applying.
 */
export function FiltersMenu({
  filters,
  onFiltersChange,
  windowOptions,
  horizonOptions,
  markets,
  currentWindowLabel,
  currentHorizonLabel,
}: {
  filters: LeakageFilterState;
  onFiltersChange: (patch: Partial<LeakageFilterState>) => void;
  windowOptions: string[];
  horizonOptions: string[];
  markets: LeakageMarketRailEntryDto[];
  /** The live, server-confirmed label for the currently selected window (`data.window.label`). */
  currentWindowLabel?: string;
  /** The live, server-confirmed label for the currently selected horizon (`data.horizon.label`). */
  currentHorizonLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [calendarTarget, setCalendarTarget] = React.useState<RangeKind>("window");

  const topSub = useCascadeSlot<TopKey>(150, 300);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [calendarMonth, setCalendarMonth] = React.useState(today);
  const [draftDate, setDraftDate] = React.useState<Date | null>(null);

  const selectedCalc = CALCULATE_OPTIONS.find((option) => option.value === filters.calculate) ?? CALCULATE_OPTIONS[0];
  const windowLabel = currentWindowLabel ?? rangeSelectionLabel(filters.window, "window");
  const horizonLabel = currentHorizonLabel ?? rangeSelectionLabel(filters.horizon, "horizon");
  const marketLabel = filters.market
    ? (markets.find((m) => m.countryCode === filters.market) && marketOptionLabel(markets.find((m) => m.countryCode === filters.market)!)) ||
      filters.market
    : "All markets";
  const severityValue = SEVERITY_OPTIONS.find((option) => option.value === filters.minSeverity);
  const confidenceValue = CONFIDENCE_OPTIONS.find((option) => option.value === filters.minConfidence);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) topSub.closeAll();
  };

  const handleCalendarOpenChange = (next: boolean) => {
    setCalendarOpen(next);
    if (!next) setDraftDate(null);
  };

  const openCustomRange = (target: RangeKind) => {
    const existing = filters[target];
    const existingDate =
      existing.kind === "custom"
        ? new Date(today.getTime() + (target === "window" ? -1 : 1) * existing.days * 86_400_000)
        : null;
    setDraftDate(existingDate);
    setCalendarMonth(existingDate ?? today);
    setCalendarTarget(target);
    handleOpenChange(false);
    setCalendarOpen(true);
  };

  const backToList = () => {
    setCalendarOpen(false);
    setOpen(true);
    topSub.open(calendarTarget);
  };

  const handleApplyCustomRange = () => {
    if (!draftDate) return;
    const days =
      calendarTarget === "window" ? daysBetween(draftDate, today) : daysBetween(today, draftDate);
    if (days <= 0) return;
    const selection: LeakageRangeSelection = { kind: "custom", days };
    onFiltersChange(calendarTarget === "window" ? { window: selection } : { horizon: selection });
    setCalendarOpen(false);
  };

  const renderRangeOptions = (target: RangeKind, options: string[]) => {
    const label = target === "window" ? windowOptionLabel : horizonOptionLabel;
    const current = filters[target];
    return (
      <>
        {options.map((value) => (
          <OptionRow
            key={value}
            label={label(value)}
            active={current.kind === "preset" && current.value === value}
            onClick={() => {
              onFiltersChange({ [target]: { kind: "preset", value } } as Partial<LeakageFilterState>);
              handleOpenChange(false);
            }}
          />
        ))}
        <div className="mt-1 border-t border-line pt-1">
          <OptionRow
            label={current.kind === "custom" ? rangeSelectionLabel(current, target) : "Custom…"}
            note={current.kind === "custom" ? "tap to change the date" : "pick any date to convert to a day count"}
            active={current.kind === "custom"}
            onClick={() => openCustomRange(target)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="relative inline-block">
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-auto items-center gap-2 rounded-panel border border-border bg-background px-2.5 py-2 text-[13px] whitespace-nowrap text-ink outline-none transition-colors hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <SlidersHorizontal className="size-3.5 shrink-0 text-ink-3" />
            <span>Filters</span>
            <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-60 p-1"
          onCloseAutoFocus={(event) => {
            if (calendarOpen) event.preventDefault();
          }}
        >
          <DropdownMenuSub
            open={topSub.active === "calc"}
            onOpenChange={(next) => (next ? topSub.open("calc") : topSub.scheduleClose("calc"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("calc")}
              onPointerLeave={() => topSub.handleLeave("calc")}
            >
              <SubHeading prefix="Calc" value={selectedCalc.label} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-64 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("calc")}
            >
              {CALCULATE_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  active={option.value === filters.calculate}
                  onClick={() => {
                    onFiltersChange({ calculate: option.value });
                    handleOpenChange(false);
                  }}
                />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub
            open={topSub.active === "window"}
            onOpenChange={(next) => (next ? topSub.open("window") : topSub.scheduleClose("window"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("window")}
              onPointerLeave={() => topSub.handleLeave("window")}
            >
              <SubHeading prefix="Window" value={windowLabel} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-72 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("window")}
            >
              {renderRangeOptions("window", windowOptions)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub
            open={topSub.active === "horizon"}
            onOpenChange={(next) => (next ? topSub.open("horizon") : topSub.scheduleClose("horizon"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("horizon")}
              onPointerLeave={() => topSub.handleLeave("horizon")}
            >
              <SubHeading prefix="Horizon" value={horizonLabel} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-72 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("horizon")}
            >
              {renderRangeOptions("horizon", horizonOptions)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub
            open={topSub.active === "market"}
            onOpenChange={(next) => (next ? topSub.open("market") : topSub.scheduleClose("market"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("market")}
              onPointerLeave={() => topSub.handleLeave("market")}
            >
              <SubHeading prefix="Market" value={marketLabel} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-64 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("market")}
            >
              <OptionRow
                label="All markets"
                note="blended across every connected market"
                active={filters.market === null}
                onClick={() => {
                  onFiltersChange({ market: null });
                  handleOpenChange(false);
                }}
              />
              {markets
                .filter((market) => market.countryCode)
                .map((market) => (
                  <OptionRow
                    key={market.countryCode}
                    label={marketOptionLabel(market)}
                    note={market.currency}
                    active={filters.market === market.countryCode}
                    onClick={() => {
                      onFiltersChange({ market: market.countryCode });
                      handleOpenChange(false);
                    }}
                  />
                ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub
            open={topSub.active === "severity"}
            onOpenChange={(next) => (next ? topSub.open("severity") : topSub.scheduleClose("severity"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("severity")}
              onPointerLeave={() => topSub.handleLeave("severity")}
            >
              <SubHeading prefix="Severity" value={severityValue?.label ?? "All"} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-56 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("severity")}
            >
              <OptionRow
                label="All severities"
                active={filters.minSeverity === null}
                onClick={() => {
                  onFiltersChange({ minSeverity: null });
                  handleOpenChange(false);
                }}
              />
              {SEVERITY_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  active={option.value === filters.minSeverity}
                  onClick={() => {
                    onFiltersChange({ minSeverity: option.value });
                    handleOpenChange(false);
                  }}
                />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub
            open={topSub.active === "confidence"}
            onOpenChange={(next) => (next ? topSub.open("confidence") : topSub.scheduleClose("confidence"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("confidence")}
              onPointerLeave={() => topSub.handleLeave("confidence")}
            >
              <SubHeading prefix="Confidence" value={confidenceValue?.label ?? "All"} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-56 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("confidence")}
            >
              <OptionRow
                label="All confidence levels"
                active={filters.minConfidence === null}
                onClick={() => {
                  onFiltersChange({ minConfidence: null });
                  handleOpenChange(false);
                }}
              />
              {CONFIDENCE_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  active={option.value === filters.minConfidence}
                  onClick={() => {
                    onFiltersChange({ minConfidence: option.value });
                    handleOpenChange(false);
                  }}
                />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={calendarOpen} onOpenChange={handleCalendarOpenChange}>
        <PopoverAnchor asChild>
          <span className="pointer-events-none absolute inset-0" />
        </PopoverAnchor>
        <PopoverContent align="end" className="w-70 p-3">
          <div className="mb-2.5 flex items-center gap-1">
            <button
              type="button"
              aria-label="Back to filter options"
              onClick={backToList}
              className="flex size-6 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <div>
              <p className="text-[12px] font-medium text-ink">
                {calendarTarget === "window" ? "Custom window" : "Custom horizon"}
              </p>
              <p className="text-[10px] text-ink-3">
                {calendarTarget === "window" ? "Pick a start date in the past" : "Pick an end date in the future"}
              </p>
            </div>
          </div>

          <div className="mb-3 rounded-control border border-line bg-paper-2 px-2.5 py-1.5">
            <span className="block font-mono text-[8.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
              {calendarTarget === "window" ? "From" : "Until"}
            </span>
            <span className={cn("block text-[11.5px]", draftDate ? "text-ink" : "text-ink-4")}>
              {draftDate
                ? draftDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                : "Select a date"}
            </span>
          </div>

          <Calendar
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            from={draftDate}
            to={draftDate}
            onSelectDate={setDraftDate}
            maxDate={calendarTarget === "window" ? today : undefined}
            minDate={calendarTarget === "horizon" ? today : undefined}
          />

          <div className="mt-3 flex items-center justify-end gap-2 border-t border-line pt-3">
            <Button type="button" variant="ghost" size="sm" onClick={backToList}>
              Cancel
            </Button>
            <Button type="button" size="sm" disabled={!draftDate} onClick={handleApplyCustomRange}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
