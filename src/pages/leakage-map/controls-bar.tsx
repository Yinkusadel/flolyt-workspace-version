import { CalcModePicker } from "@/pages/leakage-map/calc-mode-picker";
import { HorizonPicker, type HorizonState } from "@/pages/leakage-map/horizon-picker";
import { ThresholdPicker } from "@/pages/leakage-map/threshold-picker";
import { HowCalculatedDialog } from "@/pages/leakage-map/how-calculated-dialog";
import {
  CONFIDENCE_FILTER_OPTIONS,
  SEVERITY_FILTER_OPTIONS,
  type CalcMode,
  type ConfidenceLevel,
  type SeverityLevel,
} from "@/pages/leakage-map/data";

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
      <CalcModePicker value={calcMode} onChange={onCalcModeChange} />
      <HorizonPicker value={horizon} onChange={onHorizonChange} />
      <ThresholdPicker
        prefix="Severity"
        options={SEVERITY_FILTER_OPTIONS}
        value={severityFilter}
        onChange={onSeverityFilterChange}
      />
      <ThresholdPicker
        prefix="Confidence"
        options={CONFIDENCE_FILTER_OPTIONS}
        value={confidenceFilter}
        onChange={onConfidenceFilterChange}
      />
      <HowCalculatedDialog />
    </div>
  );
}
