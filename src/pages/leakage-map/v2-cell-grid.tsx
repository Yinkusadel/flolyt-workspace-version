import { Layers } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { formatCompactMoney, formatPercent } from "@/lib/format-measured-value";
import { HEAT_SCALE, HEAT_TEXT_CLASS } from "@/pages/leakage-map/data";
import { V2CellDetailDialogContent } from "@/pages/leakage-map/v2-cell-detail-dialog";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Amount, LeakageV2Cell } from "@/services/api/leakage/get-leakage";
import type { GetLeakageCellV2Params } from "@/services/api/leakage/get-leakage-cell-v2";

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
 * A real response had 150+ `limitations` entries, one per unpriced candidate (confirmed live
 * 2026-10-01 — see docs/leakage-map/v2-build-plan.md Step 0). Flat-rendering that is unusable;
 * this collapses near-duplicates by stripping any UUID-shaped token so "Candidate 'abc-123...' ...
 * in GBP" and "Candidate 'def-456...' ... in GBP" count as the same template, while genuinely
 * different sentences (e.g. a per-cell baseline note) stay distinct.
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

/**
 * V2 has no composite "intensity" field the way V1's grid cells do (that's a backend-blended
 * score V2's contract never sends) — inventing one client-side by blending amount+severity+
 * confidence would be exactly the kind of client-side metric-math [[feedback_no_frontend_business_math]]
 * bars. `severity` (a real, directly-provided "S1".."S5" field) is the closest honest substitute,
 * used alone rather than blended with anything else. 5 severity levels compress into
 * `HEAT_SCALE`'s 4 steps by capping S4 and S5 into the same top bucket — bucket 0 (the scale's own
 * "unused LOW swatch", per `data.ts`) renders as a near-neutral off-white, not a tinted color.
 */
export function heatBucketForSeverity(severity: string): 0 | 1 | 2 | 3 {
  const level = Number(severity.replace(/\D/g, ""));
  if (!level) return 0;
  return Math.min(3, level - 1) as 0 | 1 | 2 | 3;
}

const UNMEASURED_TILE_CLASS = "border border-dashed border-ink-4/40 bg-paper-2/60";

/** One amount within a shaded tile — text color follows `HEAT_TEXT_CLASS` so it stays legible as
 * the tile's own tint darkens, same contrast rule V1's matrix cells use. */
function AmountLine({ amount, heat }: { amount: LeakageV2Amount; heat: 0 | 1 | 2 | 3 }) {
  const hasRange = amount.range.status !== "UNAVAILABLE" && amount.range.lower !== null && amount.range.upper !== null;
  return (
    <div>
      <p className={`text-[15px] font-semibold tabular-nums ${HEAT_TEXT_CLASS[heat]}`}>
        {formatCompactMoney(amount.value, amount.currency)}
      </p>
      <p className={`text-[10px] ${heat >= 2 ? "text-ink-2" : "text-ink-4"}`}>
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

/**
 * One compact tile per cell, shaded by the same sequential rose scale V1's matrix uses (reused
 * from `data.ts`, not a new palette) — `UNKNOWN` cells stay the dashed/muted "unmeasured" treatment
 * V1 gives a gap cell, never heat-shaded, since there's no severity to shade by. Every tile opens
 * `GET /leakage/cells/{cellId}`'s detail dialog on click (see `v2-cell-detail-dialog.tsx`) —
 * including `UNKNOWN` ones, since their own source lineage is useful detail too.
 */
function CellTile({ cell, params }: { cell: LeakageV2Cell; params: Omit<GetLeakageCellV2Params, "cellId"> }) {
  const { display } = cell.state;
  const { coordinate } = cell;
  const primaryAmount = cell.amounts[0];
  const isCompound = cell.state.facets.includes("COMPOUND");
  const hasAmounts = cell.amounts.length > 0;

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

  const heat = display === "POPULATED" && primaryAmount ? heatBucketForSeverity(primaryAmount.severity) : 0;
  const mutedClass = heat >= 2 ? "text-ink-2" : "text-ink-4";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {display === "UNKNOWN" ? (
          <button type="button" aria-label={accessibleName} className={`rounded-control p-3 text-left ${UNMEASURED_TILE_CLASS}`}>
            <p className="text-[12px] font-medium text-ink-3">{coordinate.mechanismLabel}</p>
            <p className="mt-0.5 text-[10.5px] text-ink-4">
              {coordinate.stateDimensionLabel}: {coordinate.stateValueLabel}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-ink-4">
              Unknown
              {cell.limitations.length > 0 && <InfoTooltip missingSource={cell.limitations.join(" ")} />}
            </span>
          </button>
        ) : (
          <button
            type="button"
            aria-label={accessibleName}
            className="rounded-control p-3 text-left"
            style={{ backgroundColor: HEAT_SCALE[heat] }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-[12px] font-medium ${HEAT_TEXT_CLASS[heat]}`}>{coordinate.mechanismLabel}</p>
                <p className={`mt-0.5 text-[10.5px] ${mutedClass}`}>
                  {coordinate.stateDimensionLabel}: {coordinate.stateValueLabel}
                </p>
              </div>
              {isCompound && (
                <span
                  title="Several independently-supported candidates contribute to this figure"
                  className={`shrink-0 ${HEAT_TEXT_CLASS[heat]}`}
                >
                  <Layers className="size-3.5" aria-hidden />
                </span>
              )}
            </div>

            <div className="mt-2.5 space-y-1.5">
              {hasAmounts ? (
                cell.amounts.map((amount, i) => <AmountLine key={i} amount={amount} heat={heat} />)
              ) : (
                <p className="text-[12px] font-medium text-ink-3">No exposure</p>
              )}
              {display === "POPULATED" && primaryAmount && (
                <p className={`text-[10px] ${mutedClass}`}>
                  Severity {primaryAmount.severity} · {formatPercent(primaryAmount.confidence)} confidence
                  {primaryAmount.candidateCount > 0 && ` · ${primaryAmount.candidateCount} candidates`}
                </p>
              )}
            </div>
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <V2CellDetailDialogContent cell={cell} params={params} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * The V2 main page's cell list — see docs/leakage-map/v2-build-plan.md Steps 2–3. Redesigned
 * 2026-10-02 to borrow V1's real visual language (the sequential heat scale + legend, the
 * dashed/muted unmeasured treatment) without the grid it can't support (see the conversation on
 * why — different mechanisms don't share a second axis). Reads straight off `GET /leakage`'s own
 * `cells[]`, no per-cell fetch. `limitations[]` lives in its own `V2LimitationsCard` (see
 * v2-coverage-limitations.tsx), categorized by real sentence template instead of a flat callout.
 */
export function LeakageV2CellGrid({
  cells,
  params,
}: {
  cells: LeakageV2Cell[];
  /** The page's own active mode/horizon/lifecycleClass selection — passed through to each cell's
   * detail fetch so the dialog shows detail for the same view the tile itself renders. */
  params: Omit<GetLeakageCellV2Params, "cellId">;
}) {
  const stageGroups = groupCellsByStage(cells);

  if (stageGroups.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-6 text-center text-[12px] text-ink-3">
        No cells to show under the current filters.
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <p className="text-[12px] text-ink-3">
        Every way revenue is leaking right now, grouped by where it happens in the customer journey. Darker cards are
        more severe. Dashed cards haven't been measured yet; see what's missing in "Why the number is partial" below.
      </p>
      <div className="mt-4 space-y-5">
        {stageGroups.map(({ stageLabel, cells: stageCells }) => (
          <div key={stageLabel}>
            <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{stageLabel}</p>
            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {stageCells.map((cell) => (
                <CellTile key={cell.id} cell={cell} params={params} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-3.5 text-[10.5px]">
        <span className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">Low</span>
        <div className="flex gap-1">
          {HEAT_SCALE.map((color) => (
            <span key={color} className="size-4 rounded-xs border border-line" style={{ backgroundColor: color }} />
          ))}
        </div>
        <span className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">High</span>
        <span className="text-ink-3">Shading is severity (S1–S5). Dashed cells are unmeasured.</span>
      </div>
    </div>
  );
}
