import { formatRelativeTime } from "@/lib/format-measured-value";
import { v2OptionLabel } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Controls, LeakageV2Publication } from "@/services/api/leakage/get-leakage";

/**
 * V2's status line — same "one muted sentence, key values bolded" convention as V1's
 * `status-line.tsx`, built 2026-10-01 to replace the page's loose chips with one legible summary
 * of what's currently being shown (mirrors why V1 has this: a reader should never have to piece
 * together mode/horizon/filters from scattered controls).
 */
export function V2StatusLine({
  controls,
  publication,
  hiddenCount,
}: {
  controls: LeakageV2Controls;
  publication: LeakageV2Publication;
  hiddenCount: number;
}) {
  const modeLabel = v2OptionLabel(controls.mode.toLowerCase(), controls.modes);
  const horizonLabel = v2OptionLabel(controls.horizon, controls.horizons);
  const activeFilters = [
    controls.market && `Market ${controls.market}`,
    controls.sector && `Sector ${v2OptionLabel(controls.sector)}`,
    controls.severity && `Severity ${v2OptionLabel(controls.severity)}`,
    controls.confidence && `Confidence ${v2OptionLabel(controls.confidence)}`,
    controls.lifecycleClass && `Lifecycle ${v2OptionLabel(controls.lifecycleClass)}`,
  ].filter(Boolean) as string[];

  return (
    <div className="mt-1 space-y-1">
      <p className="text-[11.5px] text-ink-3">
        As of {formatRelativeTime(publication.asOfUtc)} · Showing:{" "}
        <span className="font-medium text-ink-2">{modeLabel}</span> ·{" "}
        <span className="font-medium text-ink-2">Horizon {horizonLabel}</span>
        {activeFilters.length > 0 && (
          <>
            {" · "}
            <span className="font-medium text-ink-2">{activeFilters.join(" · ")}</span>
          </>
        )}
      </p>
      {hiddenCount > 0 && (
        <p className="text-[11.5px] text-amber">
          {hiddenCount} cell{hiddenCount === 1 ? "" : "s"} outside this view — adjust Filters to see{" "}
          {hiddenCount === 1 ? "it" : "them"}.
        </p>
      )}
    </div>
  );
}
