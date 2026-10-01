import { KpiCards, type Kpi } from "@/components/ui/kpi-cards";
import { formatCompactCount, formatCompactMoney, formatPercent } from "@/lib/format-measured-value";
import type { LeakageV2CoverageSummary, LeakageV2Rollup } from "@/services/api/leakage/get-leakage";

/**
 * Headline numbers at the top of the V2 page — the same `KpiCards` stat-tile component used
 * across the rest of the app (e.g. every stage tab's metric row), built 2026-10-01 so this page
 * reads as the same product instead of a one-off list. Pulls the `total` rollup entry (never
 * duplicated elsewhere — `v2-rollups.tsx` drops it from its own per-dimension breakdown) plus the
 * page's own `coverage` summary.
 */
export function V2KpiStrip({ rollups, coverage }: { rollups: LeakageV2Rollup[]; coverage: LeakageV2CoverageSummary }) {
  const total = rollups.find((r) => r.dimension === "total");

  const items: Kpi[] = [
    {
      eyebrow: "Total exposure",
      value: total ? formatCompactMoney(total.amount, total.currency) : "—",
      note: total ? `${total.cellCount} cell${total.cellCount === 1 ? "" : "s"}` : undefined,
    },
    {
      eyebrow: "Coverage",
      value: coverage.effective !== null ? formatPercent(coverage.effective) : "—",
      tone: coverage.effective !== null && coverage.effective >= 0.5 ? "teal" : "amber",
      note: `${coverage.measuredSignals}/${coverage.applicableSignals} signals measured`,
    },
    {
      eyebrow: "Residual unknown",
      value: formatCompactCount(coverage.residualUnknownUnits),
      note: "units with no measured outcome yet",
    },
  ];

  return <KpiCards items={items} />;
}
