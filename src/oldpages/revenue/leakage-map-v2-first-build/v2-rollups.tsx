import { formatCompactMoney } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/oldpages/revenue/leakage-map-v2-first-build/v2-filters";
import type { LeakageV2Rollup } from "@/services/api/leakage/get-leakage";

// "total" is deliberately excluded — promoted to the page's `V2KpiStrip` headline instead of
// repeated here, per the 2026-10-01 design pass. `dimension` is a fixed 7-value union in the
// handoff doc's own `Rollup` type (not open text like `limitations[]`), so this list is exhaustive
// — a new dimension can't appear without the backend's documented contract changing first.
const DIMENSION_ORDER: LeakageV2Rollup["dimension"][] = ["market", "sector", "stage", "mechanism", "severity", "state"];

const DIMENSION_LABEL: Record<LeakageV2Rollup["dimension"], string> = {
  total: "Total",
  market: "By market",
  sector: "By sector",
  stage: "By stage",
  mechanism: "By mechanism",
  severity: "By severity",
  state: "By state",
};

/** Preserves `DIMENSION_ORDER`, not response order — rollups arrive as one flat list mixing every
 * dimension together, so grouping is required before anything is renderable. */
export function groupRollupsByDimension(
  rollups: LeakageV2Rollup[]
): { dimension: LeakageV2Rollup["dimension"]; rollups: LeakageV2Rollup[] }[] {
  const byDimension = new Map<string, LeakageV2Rollup[]>();
  for (const rollup of rollups) {
    if (!byDimension.has(rollup.dimension)) byDimension.set(rollup.dimension, []);
    byDimension.get(rollup.dimension)!.push(rollup);
  }
  return DIMENSION_ORDER.filter((d) => byDimension.has(d)).map((dimension) => ({
    dimension,
    rollups: byDimension.get(dimension)!,
  }));
}

function RollupRow({ rollup }: { rollup: LeakageV2Rollup }) {
  // "market"'s `value` is literally a currency code (e.g. "USD") — a real bug caught live
  // 2026-10-01: running it through `humanizeEnum` produced "Usd". Currency codes are never
  // humanized anywhere else on this page either (`AmountBlock` renders them raw), so this matches.
  const rowLabel = rollup.dimension === "market" ? rollup.value : humanizeEnum(rollup.value);
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="min-w-0 truncate text-[11.5px] text-ink-2">{rowLabel}</span>
      <div className="shrink-0 text-right">
        <p className="text-[12px] font-semibold text-ink tabular-nums">{formatCompactMoney(rollup.amount, rollup.currency)}</p>
        <p className="text-[9.5px] text-ink-4">
          {humanizeEnum(rollup.lifecycleClass)} · {rollup.cellCount} cell{rollup.cellCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

/**
 * V2's pre-aggregated totals — see docs/leakage-map/v2-build-plan.md Step 4. Redesigned 2026-10-02
 * off the original complaint that this panel "took up unnecessary space": the old layout gave
 * every one of the 6 dimensions its own full-width section with an uppercase header, for what's
 * mostly 1-2 rows per dimension in real data (e.g. "By market" only ever has one row in a
 * single-currency workspace). A small-card grid — same nested `bg-paper-2` card already used by
 * V1's own `CoveragePanel` — lets several thin dimensions sit side by side instead of stacking the
 * full page width down. Each rollup entry is already scoped to one currency + one lifecycle class
 * (confirmed live 2026-10-01), so rendering each row as-is naturally satisfies the doc's "never
 * combine rollups across currencies or lifecycle classes" rule.
 */
export function LeakageV2Rollups({ rollups }: { rollups: LeakageV2Rollup[] }) {
  if (rollups.length === 0) return null;
  const groups = groupRollupsByDimension(rollups);
  if (groups.length === 0) return null;

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <h2 className="text-[14.5px] font-semibold text-ink">Rollups</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ dimension, rollups: dimensionRollups }) => (
          <div key={dimension} className="rounded-control border border-line bg-paper-2 p-3">
            <p className="text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{DIMENSION_LABEL[dimension]}</p>
            <div className="mt-2 space-y-2">
              {dimensionRollups.map((rollup, i) => (
                <RollupRow key={`${dimension}-${rollup.value}-${rollup.currency}-${rollup.lifecycleClass}-${i}`} rollup={rollup} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-line pt-3 text-[10px] text-ink-4">
        Each row is its own currency and lifecycle class — never summed across either.
      </p>
    </div>
  );
}
