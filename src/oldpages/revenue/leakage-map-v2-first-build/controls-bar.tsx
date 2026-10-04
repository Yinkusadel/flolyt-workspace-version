import { FiltersMenu } from "@/oldpages/revenue/leakage-map-v2-first-build/filters-menu";
import { HowCalculatedDialog } from "@/oldpages/revenue/leakage-map-v2-first-build/how-calculated-dialog";
import type { LeakageCalculationDto, LeakageMarketRailEntryDto } from "@/services/api/leakage/get-leakage";
import type { LeakageFilterState } from "@/oldpages/revenue/leakage-map-v2-first-build/filters";

export function ControlsBar({
  filters,
  onFiltersChange,
  windowOptions,
  horizonOptions,
  markets,
  currentWindowLabel,
  currentHorizonLabel,
  calculation,
}: {
  filters: LeakageFilterState;
  onFiltersChange: (patch: Partial<LeakageFilterState>) => void;
  windowOptions: string[];
  horizonOptions: string[];
  markets: LeakageMarketRailEntryDto[];
  currentWindowLabel?: string;
  currentHorizonLabel?: string;
  calculation?: LeakageCalculationDto;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <FiltersMenu
        filters={filters}
        onFiltersChange={onFiltersChange}
        windowOptions={windowOptions}
        horizonOptions={horizonOptions}
        markets={markets}
        currentWindowLabel={currentWindowLabel}
        currentHorizonLabel={currentHorizonLabel}
      />
      <HowCalculatedDialog calculation={calculation} />
    </div>
  );
}
