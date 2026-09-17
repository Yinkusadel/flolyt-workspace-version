import { FiltersMenu } from "@/pages/leakage-map/filters-menu";
import { HowCalculatedDialog } from "@/pages/leakage-map/how-calculated-dialog";
import type { HorizonState } from "@/pages/leakage-map/horizon-picker";
import { type CalcMode, type ConfidenceLevel, type SeverityLevel } from "@/pages/leakage-map/data";

export function ControlsBar({
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
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <FiltersMenu
        calcMode={calcMode}
        onCalcModeChange={onCalcModeChange}
        horizon={horizon}
        onHorizonChange={onHorizonChange}
        severityFilter={severityFilter}
        onSeverityFilterChange={onSeverityFilterChange}
        confidenceFilter={confidenceFilter}
        onConfidenceFilterChange={onConfidenceFilterChange}
      />
      <HowCalculatedDialog />
    </div>
  );
}
