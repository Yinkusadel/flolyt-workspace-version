import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageV2Rollup } from "@/services/api/leakage/get-leakage";

const DIMENSION_ORDER: LeakageV2Rollup["dimension"][] = [
  "total",
  "market",
  "sector",
  "stage",
  "mechanism",
  "severity",
  "state",
];

const DIMENSION_LABEL: Record<LeakageV2Rollup["dimension"], string> = {
  total: "Total",
  market: "By market",
  sector: "By sector",
  stage: "By stage",
  mechanism: "By mechanism",
  severity: "By severity",
  state: "By state",
};

/** "account_activity:active" -> "Account activity · Active" — cosmetic only, rollups carry no
 * label field the way cells do (`mechanismLabel`, etc.), only the raw internal key. */
function humanizeRollupValue(value: string): string {
  return value
    .split(":")
    .map((part) => part.replace(/[_-]/g, " "))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" · ");
}

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
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 first:border-t-0">
      <span className="text-[12px] text-ink-2">{humanizeRollupValue(rollup.value)}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.5px] text-ink-4 uppercase">{rollup.lifecycleClass}</span>
        <span className="text-[13px] font-semibold text-ink">{formatCompactMoney(rollup.amount, rollup.currency)}</span>
        <span className="text-[10.5px] text-ink-4">
          {rollup.cellCount} cell{rollup.cellCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

/**
 * V2's pre-aggregated totals — see docs/leakage-map/v2-build-plan.md Step 4. Each rollup entry is
 * already scoped to one currency + one lifecycle class (confirmed live 2026-10-01), so rendering
 * each row as-is naturally satisfies the doc's "never combine rollups across currencies or
 * lifecycle classes" rule — the risk is only ever in trying to add two rows together, which this
 * component never does.
 */
export function LeakageV2Rollups({ rollups }: { rollups: LeakageV2Rollup[] }) {
  if (rollups.length === 0) return null;
  const groups = groupRollupsByDimension(rollups);

  return (
    <div className="rounded-card border border-line bg-paper">
      <p className="border-b border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink">Rollups</p>
      {groups.map(({ dimension, rollups: dimensionRollups }) => (
        <div key={dimension}>
          <p className="border-t border-line bg-paper-2 px-4 py-1.5 font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase first:border-t-0">
            {DIMENSION_LABEL[dimension]}
          </p>
          {dimensionRollups.map((rollup, i) => (
            <RollupRow key={`${dimension}-${rollup.value}-${rollup.currency}-${rollup.lifecycleClass}-${i}`} rollup={rollup} />
          ))}
        </div>
      ))}
      <p className="border-t border-line px-4 py-2 text-[10px] text-ink-4">
        Each row is its own currency and lifecycle class — never summed across either.
      </p>
    </div>
  );
}
