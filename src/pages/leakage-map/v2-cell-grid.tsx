import { Layers } from "lucide-react";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Callout } from "@/components/ui/rail";
import { formatCompactMoney, formatPercent } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Amount, LeakageV2Cell, LeakageV2DisplayState } from "@/services/api/leakage/get-leakage";

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
    // clearing the filter that hid them restores them without a re-fetch. Counted by
    // index.tsx's V2StatusLine, not shown as rows here.
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

const STATUS_DOT_CLASS: Record<LeakageV2DisplayState, string> = {
  POPULATED: "bg-teal",
  NO_EXPOSURE: "bg-ink-4",
  UNKNOWN: "bg-ink-4",
  HIDDEN_BY_FILTER: "bg-ink-4",
};

/**
 * One amount, as a single legible unit: the figure is the dominant element; everything else
 * (lifecycle class, range) is one small muted line underneath — not a row of equal-weight chips.
 * Restyled 2026-10-01 after live feedback that the first pass's chip-per-fact layout made it hard
 * to tell which value was which.
 */
function AmountBlock({ amount }: { amount: LeakageV2Amount }) {
  const hasRange = amount.range.status !== "UNAVAILABLE" && amount.range.lower !== null && amount.range.upper !== null;
  return (
    <div className="text-right">
      <p className="text-[16px] font-semibold text-ink tabular-nums">{formatCompactMoney(amount.value, amount.currency)}</p>
      <p className="text-[10.5px] text-ink-4">
        {humanizeEnum(amount.lifecycleClass)}
        {hasRange && (
          <>
            {" · "}
            {formatCompactMoney(amount.range.lower!, amount.currency)}–{formatCompactMoney(amount.range.upper!, amount.currency)}
          </>
        )}
      </p>
    </div>
  );
}

/** One row per cell — mechanism/state identity on the left, display-state-driven readout on the right. */
function CellRow({ cell }: { cell: LeakageV2Cell }) {
  const { display } = cell.state;
  const { coordinate } = cell;
  const primaryAmount = cell.amounts[0];
  const isCompound = cell.state.facets.includes("COMPOUND");

  // Accessible name per the handoff doc: mechanism, revenue stage, state value, display state,
  // amount/currency when present, severity, confidence — text/icon carries the meaning, not color.
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
    <div
      role="group"
      aria-label={accessibleName}
      className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 first:border-t-0"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${STATUS_DOT_CLASS[display]}`} aria-hidden />
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-ink">{coordinate.mechanismLabel}</p>
          <p className="text-[11px] text-ink-3">
            {coordinate.stateDimensionLabel}: {coordinate.stateValueLabel} · {coordinate.subject.unit}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        {display === "NO_EXPOSURE" &&
          (cell.amounts.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {cell.amounts.map((a, i) => (
                <AmountBlock key={i} amount={a} />
              ))}
            </div>
          ) : (
            <p className="text-[12.5px] font-medium text-ink-3">No exposure</p>
          ))}

        {display === "UNKNOWN" && (
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-4">
            Unknown
            {cell.limitations.length > 0 && <InfoTooltip missingSource={cell.limitations.join(" ")} />}
          </span>
        )}

        {display === "POPULATED" && (
          <>
            <div className="flex flex-col gap-1.5">
              {cell.amounts.map((amount, i) => (
                <AmountBlock key={i} amount={amount} />
              ))}
              {primaryAmount && (
                <p className="text-[10.5px] text-ink-4">
                  Severity {primaryAmount.severity} · {humanizeEnum(primaryAmount.confidenceLevel)} confidence (
                  {formatPercent(primaryAmount.confidence)})
                  {primaryAmount.candidateCount > 0 && ` · ${primaryAmount.candidateCount} candidates`}
                </p>
              )}
            </div>
            {isCompound && (
              <span title="Several independently-supported candidates contribute to this figure" className="mt-0.5 text-ink-4">
                <Layers className="size-3.5" aria-hidden />
              </span>
            )}
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
 * The V2 main page's cell list — see docs/leakage-map/v2-build-plan.md Steps 2–3. Reads straight
 * off `GET /leakage`'s own `cells[]`, no per-cell fetch.
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
