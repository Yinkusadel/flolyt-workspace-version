import { Chip, type ChipTone } from "@/components/ui/chip";
import { formatMoney, formatPercent } from "@/lib/format-measured-value";
import { humanizeEnum, v2OptionLabel } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Cell, LeakageV2Controls, LeakageV2CoverageSummary, LeakageV2Rollup } from "@/services/api/leakage/get-leakage";

function activeCells(cells: LeakageV2Cell[]): LeakageV2Cell[] {
  return cells.filter((c) => c.state.display !== "HIDDEN_BY_FILTER");
}

/** How many of the page's mechanisms actually got a priced figure, and whether every priced
 * amount shares one lifecycle class worth calling out (e.g. "all in flight") — `null` when they're
 * mixed, since "all X" would be false. Counts, not an invented ratio. */
function pricedMechanismSummary(cells: LeakageV2Cell[]): {
  pricedCount: number;
  totalCount: number;
  uniformLifecycleClass: string | null;
} {
  const active = activeCells(cells);
  const populated = active.filter((c) => c.state.display === "POPULATED");
  const lifecycleClasses = new Set(populated.flatMap((c) => c.amounts.map((a) => a.lifecycleClass)));
  return {
    pricedCount: populated.length,
    totalCount: active.length,
    uniformLifecycleClass: lifecycleClasses.size === 1 ? [...lifecycleClasses][0] : null,
  };
}

/** Sums each priced amount's own `candidateCount` grouped by mechanism — a straight sum of one
 * field across rows (same discipline as a rollup's own `cellCount`), never blended with a
 * different metric. */
function candidatesByMechanism(cells: LeakageV2Cell[]): { mechanismLabel: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const cell of activeCells(cells)) {
    for (const amount of cell.amounts) {
      if (amount.candidateCount > 0) {
        counts.set(cell.coordinate.mechanismLabel, (counts.get(cell.coordinate.mechanismLabel) ?? 0) + amount.candidateCount);
      }
    }
  }
  return Array.from(counts.entries())
    .map(([mechanismLabel, count]) => ({ mechanismLabel, count }))
    .sort((a, b) => b.count - a.count);
}

const RANGE_STATUS_COPY: Record<string, string> = {
  ASSUMPTION: "Thin-data assumption ranges",
  CALIBRATED: "Calibrated ranges",
  EMPIRICAL: "Empirically measured ranges",
  UNAVAILABLE: "No range available",
};

const CONFIDENCE_TONE: Record<string, ChipTone> = { LOW: "amber", MEDIUM: "neutral", HIGH: "teal" };

/** The single lowest-confidence priced amount across every cell — a worst-case flag, not an
 * average. Averaging confidence across cells of different mechanisms/severities/currencies would
 * be exactly the client-side metric-blending [[feedback_no_frontend_business_math]] bars; picking
 * the minimum is a real value that already exists on one real row. */
function lowestConfidenceAmount(
  cells: LeakageV2Cell[]
): { confidence: number; confidenceLevel: string; rangeStatus: string } | null {
  let lowest: { confidence: number; confidenceLevel: string; rangeStatus: string } | null = null;
  for (const cell of activeCells(cells)) {
    for (const amount of cell.amounts) {
      if (!lowest || amount.confidence < lowest.confidence) {
        lowest = { confidence: amount.confidence, confidenceLevel: amount.confidenceLevel, rangeStatus: amount.range.status };
      }
    }
  }
  return lowest;
}

/**
 * Headline numbers at the top of the V2 page. Restyled 2026-10-01 off a real captured response
 * (`leakageresponse.json`) and a reference design the user shared — kept the reference's shape
 * (one dark hero card, sentence-case labels, mono tabular figures, a bar/pill where the data has
 * one) but not its literal colors, which are this app's own tokens instead. Each card reads one
 * real field or a straight sum/min of the same field across rows — see the helpers above for why
 * each one stays clear of [[feedback_no_frontend_business_math]].
 */
export function V2KpiStrip({
  cells,
  rollups,
  coverage,
  controls,
}: {
  cells: LeakageV2Cell[];
  rollups: LeakageV2Rollup[];
  coverage: LeakageV2CoverageSummary;
  controls: LeakageV2Controls;
}) {
  const total = rollups.find((r) => r.dimension === "total");
  const modeLabel = v2OptionLabel(controls.mode.toLowerCase(), controls.modes);
  const horizonLabel = v2OptionLabel(controls.horizon, controls.horizons);

  const { pricedCount, totalCount, uniformLifecycleClass } = pricedMechanismSummary(cells);
  const candidates = candidatesByMechanism(cells);
  const totalCandidates = candidates.reduce((sum, c) => sum + c.count, 0);
  const lowestConfidence = lowestConfidenceAmount(cells);

  const coverageTone = coverage.effective !== null && coverage.effective >= 0.5 ? "bg-teal" : "bg-amber";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-card bg-ink p-4">
        <p className="text-[11.5px] text-paper/60">
          Total at risk · {modeLabel} · {horizonLabel}
        </p>
        <p className="mt-2.5 font-mono text-[21px] font-semibold text-paper tabular-nums">
          {total ? formatMoney(total.amount, total.currency) : "—"}
        </p>
        <p className="mt-1.5 text-[11px] text-paper/60">
          {pricedCount} of {totalCount} mechanism{totalCount === 1 ? "" : "s"} priced
          {uniformLifecycleClass && ` · all ${humanizeEnum(uniformLifecycleClass).toLowerCase()}`}
        </p>
      </div>

      <div className="rounded-card border border-line bg-paper p-4">
        <p className="text-[11.5px] text-ink-3">Candidates flagged</p>
        <p className="mt-2.5 font-mono text-[21px] font-semibold text-ink tabular-nums">
          {totalCandidates > 0 ? totalCandidates : "—"}
        </p>
        <p className="mt-1.5 text-[11px] text-ink-4">
          {candidates.length > 0
            ? candidates.map((c) => `${c.count} ${c.mechanismLabel}`).join(" · ")
            : "none priced yet"}
        </p>
      </div>

      <div className="rounded-card border border-line bg-paper p-4">
        <p className="text-[11.5px] text-ink-3">Effective coverage</p>
        <p className="mt-2.5 font-mono text-[21px] font-semibold text-ink tabular-nums">
          {coverage.effective !== null ? formatPercent(coverage.effective) : "—"}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
          <div
            className={`h-1.5 rounded-full ${coverageTone}`}
            style={{ width: coverage.effective !== null ? `${Math.round(coverage.effective * 100)}%` : "0%" }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-ink-4">
          {coverage.measuredSignals}/{coverage.applicableSignals} signals measured
        </p>
      </div>

      <div className="rounded-card border border-line bg-paper p-4">
        <p className="text-[11.5px] text-ink-3">Lowest confidence</p>
        <div className="mt-2.5 flex items-baseline gap-2">
          <p className="font-mono text-[21px] font-semibold text-ink tabular-nums">
            {lowestConfidence ? lowestConfidence.confidence.toFixed(2) : "—"}
          </p>
          {lowestConfidence && <Chip tone={CONFIDENCE_TONE[lowestConfidence.confidenceLevel] ?? "neutral"}>{lowestConfidence.confidenceLevel}</Chip>}
        </div>
        <p className="mt-1.5 text-[11px] text-ink-4">
          {lowestConfidence ? RANGE_STATUS_COPY[lowestConfidence.rangeStatus] : "No priced candidates yet"}
        </p>
      </div>
    </div>
  );
}
