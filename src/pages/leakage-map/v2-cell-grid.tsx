import { Chip } from "@/components/ui/chip";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Callout } from "@/components/ui/rail";
import { formatCompactMoney, formatPercent } from "@/lib/format-measured-value";
import type { LeakageV2Amount, LeakageV2Cell } from "@/services/api/leakage/get-leakage";

/**
 * V2's main-page response has no grid/row/column structure the way `GET /leakage`'s `grids[]`
 * did — `cells[]` is a flat list, each cell already fully resolved to one
 * mechanism × state-value coordinate (not a pivot of mechanism × every possible state, since
 * different mechanisms carry entirely different state dimensions — "dormant_accounts" uses
 * "account activity", "overdue_invoice" uses "collection state", confirmed live 2026-10-01).
 * So there's no matrix to render here, only a list. Grouping by `revenueStageLabel` (the one
 * axis every cell shares) is the least invented way to organize it — order follows first-seen
 * in the response, since the API gives no explicit stage ordering.
 */
export function groupCellsByStage(cells: LeakageV2Cell[]): { stageLabel: string; cells: LeakageV2Cell[] }[] {
  const order: string[] = [];
  const byStage = new Map<string, LeakageV2Cell[]>();
  for (const cell of cells) {
    // HIDDEN_BY_FILTER cells stay loaded (per the handoff doc) but drop out of the active view —
    // clearing the filter that hid them restores them without a re-fetch. Not yet exercised live;
    // no filter sends a severity/sector/etc. value yet (Step 3).
    if (cell.state.display === "HIDDEN_BY_FILTER") continue;
    const stageLabel = cell.coordinate.revenueStageLabel;
    if (!byStage.has(stageLabel)) {
      byStage.set(stageLabel, []);
      order.push(stageLabel);
    }
    byStage.get(stageLabel)!.push(cell);
  }
  return order.map((stageLabel) => ({ stageLabel, cells: byStage.get(stageLabel)! }));
}

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

/**
 * A real response had 150+ `limitations` entries, one per unpriced candidate, differing only by
 * an id and a currency code (confirmed live 2026-10-01 — see docs/leakage-map/v2-build-plan.md
 * Step 0). Flat-rendering that is unusable; this collapses near-duplicates by stripping any
 * UUID-shaped token so "Candidate 'abc-123...' ... in GBP" and "Candidate 'def-456...' ... in GBP"
 * count as the same template, while genuinely different sentences (e.g. a per-cell baseline note)
 * stay distinct.
 */
export function groupLimitations(limitations: string[]): { template: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const raw of limitations) {
    const template = raw.replace(UUID_RE, "…");
    counts.set(template, (counts.get(template) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([template, count]) => ({ template, count }))
    .sort((a, b) => b.count - a.count);
}

function AmountRow({ amount }: { amount: LeakageV2Amount }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-[14px] font-semibold text-ink">{formatCompactMoney(amount.value, amount.currency)}</span>
      <span className="text-[10px] text-ink-4 uppercase">{amount.lifecycleClass}</span>
      {amount.range.status !== "UNAVAILABLE" && amount.range.lower !== null && amount.range.upper !== null && (
        <span className="text-[10.5px] text-ink-4">
          {formatCompactMoney(amount.range.lower, amount.currency)}–{formatCompactMoney(amount.range.upper, amount.currency)}
        </span>
      )}
    </div>
  );
}

/** One row per cell — mechanism/state identity on the left, display-state-driven readout on the right. */
function CellRow({ cell }: { cell: LeakageV2Cell }) {
  const { display } = cell.state;
  const { coordinate } = cell;

  // Accessible name per the handoff doc: mechanism, revenue stage, state value, display state,
  // amount/currency when present, severity, confidence — text/icon carries the meaning, not color.
  const primaryAmount = cell.amounts[0];
  const accessibleName = [
    coordinate.mechanismLabel,
    coordinate.revenueStageLabel,
    coordinate.stateValueLabel,
    display,
    primaryAmount ? `${primaryAmount.value} ${primaryAmount.currency}` : null,
    primaryAmount ? `severity ${primaryAmount.severity}` : null,
    primaryAmount ? `confidence ${primaryAmount.confidenceLevel}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div role="group" aria-label={accessibleName} className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 first:border-t-0">
      <div className="min-w-0">
        <p className="text-[12.5px] font-medium text-ink">{coordinate.mechanismLabel}</p>
        <p className="text-[11px] text-ink-3">
          {coordinate.stateDimensionLabel}: {coordinate.stateValueLabel} · {coordinate.subject.unit}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {display === "NO_EXPOSURE" && (
          <div className="text-[12.5px] font-medium text-ink-3">
            {/* Unconfirmed live whether a NO_EXPOSURE cell still carries a zero-valued amounts[] entry
                or comes back empty like UNKNOWN — handling both until a real example is seen. */}
            {cell.amounts.length > 0 ? cell.amounts.map((a, i) => <AmountRow key={i} amount={a} />) : "No exposure"}
          </div>
        )}

        {display === "UNKNOWN" && (
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-4">
            Unknown
            {cell.limitations.length > 0 && <InfoTooltip missingSource={cell.limitations.join(" ")} />}
          </span>
        )}

        {display === "POPULATED" && (
          <div className="flex flex-col items-end gap-1">
            {cell.amounts.map((amount, i) => (
              <AmountRow key={i} amount={amount} />
            ))}
          </div>
        )}

        {primaryAmount && (
          <>
            <Chip tone="neutral">Severity {primaryAmount.severity}</Chip>
            <Chip tone="neutral">
              {primaryAmount.confidenceLevel} confidence ({formatPercent(primaryAmount.confidence)})
            </Chip>
            {primaryAmount.candidateCount > 0 && <Chip tone="neutral">{primaryAmount.candidateCount} candidates</Chip>}
            {cell.state.facets.includes("COMPOUND") && <Chip tone="ultra">Compound</Chip>}
          </>
        )}
      </div>
    </div>
  );
}

function LimitationsSummary({ limitations }: { limitations: string[] }) {
  if (limitations.length === 0) return null;
  const grouped = groupLimitations(limitations);
  return (
    <Callout tone="amber" title={`${limitations.length} limitation${limitations.length === 1 ? "" : "s"} on this projection`}>
      {/* Callout renders its children inside a <p> — a <ul> there is invalid nesting (caught live
          2026-10-01), so each group is a line of inline text instead. */}
      {grouped.map(({ template, count }, i) => (
        <span key={template}>
          {i > 0 && <br />}
          {count > 1 ? `${count}× ` : ""}
          {template}
        </span>
      ))}
    </Callout>
  );
}

/**
 * The V2 main page's cell list — see docs/leakage-map/v2-build-plan.md Step 2. Reads straight off
 * `GET /leakage`'s own `cells[]`, no per-cell fetch. Filters (Step 3) and rollups (Step 4) aren't
 * wired yet; this is the grid itself.
 */
export function LeakageV2CellGrid({ cells, limitations }: { cells: LeakageV2Cell[]; limitations: string[] }) {
  const stageGroups = groupCellsByStage(cells);

  if (stageGroups.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center text-[12px] text-ink-3">
        No cells to show under the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LimitationsSummary limitations={limitations} />
      {stageGroups.map(({ stageLabel, cells: stageCells }) => (
        <div key={stageLabel} className="rounded-card border border-line bg-paper">
          <p className="border-b border-line px-4 py-2.5 font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
            {stageLabel}
          </p>
          {stageCells.map((cell) => (
            <CellRow key={cell.id} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}
