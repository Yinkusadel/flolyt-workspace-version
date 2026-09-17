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
import {
  CALC_MODE_OPTIONS,
  CONFIDENCE_FILTER_OPTIONS,
  HORIZON_FOOTNOTE,
  HORIZON_GROUPS,
  SEVERITY_FILTER_OPTIONS,
  type CalcMode,
  type ConfidenceLevel,
  type SeverityLevel,
} from "@/pages/leakage-map/data";
import { formatRange, horizonLabel, startOfDay, type HorizonState } from "@/pages/leakage-map/horizon-picker";

const LOOKING_BACK_GROUP = HORIZON_GROUPS.find((group) => group.heading === "Looking back")!;
const LOOKING_FORWARD_GROUP = HORIZON_GROUPS.find((group) => group.heading === "Looking forward")!;

function OptionRow({
  label,
  note,
  active,
  onClick,
}: {
  label: string;
  note: string;
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
        <span className="block text-[10.5px] text-ink-3">{note}</span>
      </span>
      {active && <Check className="size-3.5 shrink-0 text-ultra" />}
    </button>
  );
}

function SubHeading({
  prefix,
  value,
}: {
  prefix: string;
  value: string;
}) {
  return (
    <span className="block flex-1 text-left">
      <span className="text-ink-3">{prefix} </span>
      <span className="text-ink">{value}</span>
    </span>
  );
}

function DirectionRowLabel({ label, note }: { label: string; note: string }) {
  return (
    <span className="block flex-1 text-left">
      <span className="block text-[12px] font-medium text-ink">{label}</span>
      <span className="block text-[10.5px] text-ink-3">{note}</span>
    </span>
  );
}

/**
 * Manages one cascading level of the Filters menu: which key (if any) is "active" — i.e. open —
 * among a set of siblings, driven by both click (instant) and hover. Hover only takes over after
 * `openDelayMs` of dwelling on a trigger, and only lets go `closeDelayMs` after the pointer has
 * left both the trigger and its content — see the FiltersMenu doc comment for why. Used once for
 * the top-level categories (Calc/Horizon/Severity/Confidence) and again for Horizon's own
 * Looking-back/Looking-forward split, so two levels of cascade can each track their own open child
 * independently.
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

/**
 * One filters trigger — an icon button that opens a list of categories (Calc, Horizon, Severity,
 * Confidence), each cascading its own options into a submenu beside it, same interaction as a
 * native OS menu / the app's own account menu. Replaces the four standalone popovers this page
 * used to show side by side.
 *
 * Horizon itself cascades one level further into Looking back / Looking forward, each with its own
 * presets and its own "Custom range" entry (so a custom span is always explicitly past or future,
 * rather than one shared range that could straddle today). "Custom range" is the one step that
 * can't live as another nested DropdownMenuSub: Radix's Menu content, under this repo's
 * preact/compat setup, closes a submenu back to its parent on any inner click that doesn't itself
 * select-and-close (confirmed live — see [[preact_radix_dialog_crash]] for the sibling
 * Presence/ref bug this stack already has). A free-form multi-click calendar is exactly that case,
 * so picking "Custom range" closes this whole menu and opens a separate Popover (anchored to the
 * same trigger button) for the calendar — the same proven Popover+Calendar pattern the old
 * standalone HorizonPicker used.
 *
 * horizon-picker.tsx keeps HorizonState/horizonLabel for the status line; its old standalone
 * HorizonPicker component (and calc-mode-picker.tsx / threshold-picker.tsx) is gone now that
 * everything lives here.
 */
export function FiltersMenu({
  calcMode,
  onCalcModeChange,
  horizon,
  onHorizonChange,
  severityFilter,
  onSeverityFilterChange,
  confidenceFilter,
  onConfidenceFilterChange,
}: {
  calcMode: CalcMode;
  onCalcModeChange: (value: CalcMode) => void;
  horizon: HorizonState;
  onHorizonChange: (value: HorizonState) => void;
  severityFilter: SeverityLevel;
  onSeverityFilterChange: (value: SeverityLevel) => void;
  confidenceFilter: ConfidenceLevel;
  onConfidenceFilterChange: (value: ConfidenceLevel) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [customDirection, setCustomDirection] = React.useState<"back" | "forward">("forward");

  type TopKey = "calc" | "horizon" | "severity" | "confidence";
  const topSub = useCascadeSlot<TopKey>(150, 300);
  const horizonDir = useCascadeSlot<"back" | "forward">(150, 300);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [calendarMonth, setCalendarMonth] = React.useState(today);
  const [draftFrom, setDraftFrom] = React.useState<Date | null>(null);
  const [draftTo, setDraftTo] = React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const selectedCalc = CALC_MODE_OPTIONS.find((option) => option.value === calcMode) ?? CALC_MODE_OPTIONS[1];
  const currentHorizonLabel = horizonLabel(horizon);

  const isCustomBack = horizon.kind === "custom" && horizon.to < today;
  const isCustomForward = horizon.kind === "custom" && horizon.from >= today;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      topSub.closeAll();
      horizonDir.closeAll();
    }
  };

  const handleCalendarOpenChange = (next: boolean) => {
    setCalendarOpen(next);
    if (!next) {
      setDraftFrom(null);
      setDraftTo(null);
      setHoverDate(null);
    }
  };

  const openCustomRange = (direction: "back" | "forward") => {
    const matchesDirection = direction === "back" ? isCustomBack : isCustomForward;
    const existing = matchesDirection && horizon.kind === "custom" ? horizon : null;
    setDraftFrom(existing?.from ?? null);
    setDraftTo(existing?.to ?? null);
    setCalendarMonth(existing ? startOfDay(existing.to) : today);
    setHoverDate(null);
    setCustomDirection(direction);
    handleOpenChange(false);
    setCalendarOpen(true);
  };

  const backToHorizonList = () => {
    setCalendarOpen(false);
    setOpen(true);
    topSub.open("horizon");
    horizonDir.open(customDirection);
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

  const handleApplyCustomRange = () => {
    if (!draftFrom || !draftTo) return;
    onHorizonChange({ kind: "custom", from: draftFrom, to: draftTo });
    setCalendarOpen(false);
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
              {CALC_MODE_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  note={option.note}
                  active={option.value === calcMode}
                  onClick={() => {
                    onCalcModeChange(option.value);
                    handleOpenChange(false);
                  }}
                />
              ))}
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
              <SubHeading prefix="Horizon" value={currentHorizonLabel} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-64 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("horizon")}
            >
              <DropdownMenuSub
                open={horizonDir.active === "back"}
                onOpenChange={(next) => (next ? horizonDir.open("back") : horizonDir.scheduleClose("back"))}
              >
                <DropdownMenuSubTrigger
                  className="justify-between"
                  onPointerEnter={() => horizonDir.handleEnter("back")}
                  onPointerLeave={() => horizonDir.handleLeave("back")}
                >
                  <DirectionRowLabel label="Looking back" note="presets, or a custom past range" />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  className="w-72 p-1"
                  sideOffset={4}
                  onPointerEnter={horizonDir.clearClose}
                  onPointerLeave={() => horizonDir.scheduleClose("back")}
                >
                  {LOOKING_BACK_GROUP.options.map((option) => {
                    const isActive =
                      horizon.kind === "preset" && horizon.value === option.value && horizon.direction === "back";
                    return (
                      <OptionRow
                        key={option.value}
                        label={option.label}
                        note={option.note}
                        active={isActive}
                        onClick={() => {
                          onHorizonChange({ kind: "preset", value: option.value, direction: "back" });
                          handleOpenChange(false);
                        }}
                      />
                    );
                  })}
                  <div className="mt-1 border-t border-line pt-1">
                    <OptionRow
                      label={isCustomBack && horizon.kind === "custom" ? formatRange(horizon.from, horizon.to) : "Custom range…"}
                      note={isCustomBack ? "tap to change the dates" : "pick any start and end date up to today"}
                      active={isCustomBack}
                      onClick={() => openCustomRange("back")}
                    />
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub
                open={horizonDir.active === "forward"}
                onOpenChange={(next) => (next ? horizonDir.open("forward") : horizonDir.scheduleClose("forward"))}
              >
                <DropdownMenuSubTrigger
                  className="justify-between"
                  onPointerEnter={() => horizonDir.handleEnter("forward")}
                  onPointerLeave={() => horizonDir.handleLeave("forward")}
                >
                  <DirectionRowLabel label="Looking forward" note="presets, or a custom future range" />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  className="w-72 p-1"
                  sideOffset={4}
                  onPointerEnter={horizonDir.clearClose}
                  onPointerLeave={() => horizonDir.scheduleClose("forward")}
                >
                  {LOOKING_FORWARD_GROUP.options.map((option) => {
                    const isActive =
                      horizon.kind === "preset" && horizon.value === option.value && horizon.direction === "forward";
                    return (
                      <OptionRow
                        key={option.value}
                        label={option.label}
                        note={option.note}
                        active={isActive}
                        onClick={() => {
                          onHorizonChange({ kind: "preset", value: option.value, direction: "forward" });
                          handleOpenChange(false);
                        }}
                      />
                    );
                  })}
                  <div className="mt-1 border-t border-line pt-1">
                    <OptionRow
                      label={
                        isCustomForward && horizon.kind === "custom" ? formatRange(horizon.from, horizon.to) : "Custom range…"
                      }
                      note={isCustomForward ? "tap to change the dates" : "pick any start and end date from today"}
                      active={isCustomForward}
                      onClick={() => openCustomRange("forward")}
                    />
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <div className="mt-1 border-t border-line px-2.5 pt-2 text-[10.5px] leading-relaxed text-ink-4">
                {HORIZON_FOOTNOTE}
              </div>
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
              <SubHeading prefix="Severity" value={SEVERITY_FILTER_OPTIONS.find((o) => o.value === severityFilter)?.label ?? ""} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-60 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("severity")}
            >
              {SEVERITY_FILTER_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  note={option.note}
                  active={option.value === severityFilter}
                  onClick={() => {
                    onSeverityFilterChange(option.value);
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
              <SubHeading
                prefix="Confidence"
                value={CONFIDENCE_FILTER_OPTIONS.find((o) => o.value === confidenceFilter)?.label ?? ""}
              />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-60 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("confidence")}
            >
              {CONFIDENCE_FILTER_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  note={option.note}
                  active={option.value === confidenceFilter}
                  onClick={() => {
                    onConfidenceFilterChange(option.value);
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
        <PopoverContent align="end" className="w-[296px] p-3">
          <div className="mb-2.5 flex items-center gap-1">
            <button
              type="button"
              aria-label="Back to horizon options"
              onClick={backToHorizonList}
              className="flex size-6 items-center justify-center rounded-control text-ink-3 hover:bg-paper-2 hover:text-ink"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <div>
              <p className="text-[12px] font-medium text-ink">Custom range</p>
              <p className="text-[10px] text-ink-3">{customDirection === "back" ? "Past dates only" : "Future dates only"}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex-1 rounded-control border border-line bg-paper-2 px-2.5 py-1.5">
              <span className="block font-mono text-[8.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">From</span>
              <span className={cn("block text-[11.5px]", draftFrom ? "text-ink" : "text-ink-4")}>
                {draftFrom
                  ? draftFrom.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                  : "Select a date"}
              </span>
            </div>
            <div className="flex-1 rounded-control border border-line bg-paper-2 px-2.5 py-1.5">
              <span className="block font-mono text-[8.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">To</span>
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
            maxDate={customDirection === "back" ? today : undefined}
            minDate={customDirection === "forward" ? today : undefined}
          />

          <div className="mt-3 flex items-center justify-end gap-2 border-t border-line pt-3">
            <Button type="button" variant="ghost" size="sm" onClick={backToHorizonList}>
              Cancel
            </Button>
            <Button type="button" size="sm" disabled={!draftFrom || !draftTo} onClick={handleApplyCustomRange}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
