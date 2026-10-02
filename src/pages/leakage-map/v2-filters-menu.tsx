import * as React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OptionRow, SubHeading, useCascadeSlot } from "@/pages/leakage-map/cascade-menu";
import { v2OptionLabel, type LeakageV2FilterState } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";

type TopKey = "mode" | "horizon" | "market" | "sector" | "severity" | "confidence" | "lifecycleClass";

/**
 * V2's filter controls, restyled 2026-10-01 to match V1's single-trigger cascading menu
 * (`filters-menu.tsx`) instead of a row of 7 raw `<select>` elements — reuses the exact same
 * interaction via `cascade-menu.tsx`. Every option list is the response's own `controls.*`, same
 * discipline as before. Unlike V1's Window, V2's "Custom" horizon is just a day count (no date to
 * convert), so it's a plain inline number field in the submenu rather than a separate calendar
 * popover.
 */
export function V2FiltersMenu({
  controls,
  filters,
  onFiltersChange,
}: {
  controls: LeakageV2Controls;
  filters: LeakageV2FilterState;
  onFiltersChange: (patch: Partial<LeakageV2FilterState>) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const topSub = useCascadeSlot<TopKey>(150, 300);
  const [draftHorizonDays, setDraftHorizonDays] = React.useState(filters.horizonDays);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) topSub.closeAll();
  };

  const modeLabel = v2OptionLabel(filters.mode, controls.modes);
  const horizonLabel =
    filters.horizon === "custom" ? `${filters.horizonDays} days` : v2OptionLabel(filters.horizon, controls.horizons);
  const marketLabel = filters.market ?? "All markets";
  const sectorLabel = filters.sector ? v2OptionLabel(filters.sector) : "All sectors";
  const severityLabel = filters.severity ? v2OptionLabel(filters.severity) : "All severities";
  const confidenceLabel = filters.confidence ? v2OptionLabel(filters.confidence) : "All confidence";
  const lifecycleLabel = filters.lifecycleClass ? v2OptionLabel(filters.lifecycleClass) : "All lifecycle classes";

  const activeFilterCount = [filters.market, filters.sector, filters.severity, filters.confidence, filters.lifecycleClass].filter(
    Boolean
  ).length;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-auto items-center gap-2 rounded-panel border border-border bg-background px-2.5 py-2 text-[13px] whitespace-nowrap text-ink outline-none transition-colors hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <SlidersHorizontal className="size-3.5 shrink-0 text-ink-3" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-ultra text-[9.5px] font-semibold text-paper">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1">
        <DropdownMenuSub open={topSub.active === "mode"} onOpenChange={(next) => (next ? topSub.open("mode") : topSub.scheduleClose("mode"))}>
          <DropdownMenuSubTrigger
            className="justify-between"
            onPointerEnter={() => topSub.handleEnter("mode")}
            onPointerLeave={() => topSub.handleLeave("mode")}
          >
            <SubHeading prefix="Mode" value={modeLabel} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56 p-1" sideOffset={4} onPointerEnter={topSub.clearClose} onPointerLeave={() => topSub.scheduleClose("mode")}>
            {controls.modes.map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                active={option.value === filters.mode}
                onClick={() => {
                  onFiltersChange({ mode: option.value });
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
            <SubHeading prefix="Horizon" value={horizonLabel} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-60 p-1"
            sideOffset={4}
            onPointerEnter={topSub.clearClose}
            onPointerLeave={() => topSub.scheduleClose("horizon")}
          >
            {controls.horizons
              .filter((o) => o.value !== "custom")
              .map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  active={filters.horizon === option.value}
                  onClick={() => {
                    onFiltersChange({ horizon: option.value });
                    handleOpenChange(false);
                  }}
                />
              ))}
            <div className="mt-1 flex items-center gap-1.5 border-t border-line px-2.5 pt-2">
              <input
                type="number"
                min={1}
                max={365}
                value={draftHorizonDays}
                onChange={(e) => setDraftHorizonDays(Number(e.currentTarget.value) || 1)}
                className="w-16 rounded-control border border-line bg-paper px-2 py-1 text-[11.5px] text-ink outline-none"
                aria-label="Custom horizon, in days"
              />
              <span className="text-[10.5px] text-ink-3">days</span>
              <Button
                type="button"
                size="sm"
                variant={filters.horizon === "custom" ? "default" : "outline"}
                className="ml-auto h-6 px-2 text-[10.5px]"
                onClick={() => {
                  onFiltersChange({ horizon: "custom", horizonDays: draftHorizonDays });
                  handleOpenChange(false);
                }}
              >
                Apply
              </Button>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {controls.markets.length > 0 && (
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
              className="w-56 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("market")}
            >
              <OptionRow
                label="All markets"
                active={filters.market === null}
                onClick={() => {
                  onFiltersChange({ market: null });
                  handleOpenChange(false);
                }}
              />
              {controls.markets.map((market) => (
                <OptionRow
                  key={market}
                  label={market}
                  active={filters.market === market}
                  onClick={() => {
                    onFiltersChange({ market });
                    handleOpenChange(false);
                  }}
                />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {controls.sectors.length > 0 && (
          <DropdownMenuSub
            open={topSub.active === "sector"}
            onOpenChange={(next) => (next ? topSub.open("sector") : topSub.scheduleClose("sector"))}
          >
            <DropdownMenuSubTrigger
              className="justify-between"
              onPointerEnter={() => topSub.handleEnter("sector")}
              onPointerLeave={() => topSub.handleLeave("sector")}
            >
              <SubHeading prefix="Sector" value={sectorLabel} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="w-56 p-1"
              sideOffset={4}
              onPointerEnter={topSub.clearClose}
              onPointerLeave={() => topSub.scheduleClose("sector")}
            >
              <OptionRow
                label="All sectors"
                active={filters.sector === null}
                onClick={() => {
                  onFiltersChange({ sector: null });
                  handleOpenChange(false);
                }}
              />
              {controls.sectors.map((sector) => (
                <OptionRow
                  key={sector}
                  label={v2OptionLabel(sector)}
                  active={filters.sector === sector}
                  onClick={() => {
                    onFiltersChange({ sector });
                    handleOpenChange(false);
                  }}
                />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <DropdownMenuSub
          open={topSub.active === "severity"}
          onOpenChange={(next) => (next ? topSub.open("severity") : topSub.scheduleClose("severity"))}
        >
          <DropdownMenuSubTrigger
            className="justify-between"
            onPointerEnter={() => topSub.handleEnter("severity")}
            onPointerLeave={() => topSub.handleLeave("severity")}
          >
            <SubHeading prefix="Severity" value={severityLabel} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-48 p-1"
            sideOffset={4}
            onPointerEnter={topSub.clearClose}
            onPointerLeave={() => topSub.scheduleClose("severity")}
          >
            <OptionRow
              label="All severities"
              active={filters.severity === null}
              onClick={() => {
                onFiltersChange({ severity: null });
                handleOpenChange(false);
              }}
            />
            {controls.severities.map((severity) => (
              <OptionRow
                key={severity}
                label={v2OptionLabel(severity)}
                active={filters.severity === severity}
                onClick={() => {
                  onFiltersChange({ severity });
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
            <SubHeading prefix="Confidence" value={confidenceLabel} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-52 p-1"
            sideOffset={4}
            onPointerEnter={topSub.clearClose}
            onPointerLeave={() => topSub.scheduleClose("confidence")}
          >
            <OptionRow
              label="All confidence levels"
              active={filters.confidence === null}
              onClick={() => {
                onFiltersChange({ confidence: null });
                handleOpenChange(false);
              }}
            />
            {controls.confidenceLevels.map((level) => (
              <OptionRow
                key={level}
                label={v2OptionLabel(level)}
                active={filters.confidence === level}
                onClick={() => {
                  onFiltersChange({ confidence: level });
                  handleOpenChange(false);
                }}
              />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub
          open={topSub.active === "lifecycleClass"}
          onOpenChange={(next) => (next ? topSub.open("lifecycleClass") : topSub.scheduleClose("lifecycleClass"))}
        >
          <DropdownMenuSubTrigger
            className="justify-between"
            onPointerEnter={() => topSub.handleEnter("lifecycleClass")}
            onPointerLeave={() => topSub.handleLeave("lifecycleClass")}
          >
            <SubHeading prefix="Lifecycle" value={lifecycleLabel} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-56 p-1"
            sideOffset={4}
            onPointerEnter={topSub.clearClose}
            onPointerLeave={() => topSub.scheduleClose("lifecycleClass")}
          >
            <OptionRow
              label="All lifecycle classes"
              active={filters.lifecycleClass === null}
              onClick={() => {
                onFiltersChange({ lifecycleClass: null });
                handleOpenChange(false);
              }}
            />
            {controls.lifecycleClasses.map((lifecycleClass) => (
              <OptionRow
                key={lifecycleClass}
                label={v2OptionLabel(lifecycleClass)}
                active={filters.lifecycleClass === lifecycleClass}
                onClick={() => {
                  onFiltersChange({ lifecycleClass });
                  handleOpenChange(false);
                }}
              />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
