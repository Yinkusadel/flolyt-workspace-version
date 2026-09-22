import { FiltersMenu } from "@/pages/leakage-map/filters-menu";
import { HowCalculatedDialog } from "@/pages/leakage-map/how-calculated-dialog";
import type { LeakageMarketRailEntryDto } from "@/services/api/leakage/get-leakage";
import type { LeakageFilterState } from "@/pages/leakage-map/filters";

export function ControlsBar({
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
  currentWindowLabel?: string;
  currentHorizonLabel?: string;
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
      <HowCalculatedDialog />
    </div>
  );
}
