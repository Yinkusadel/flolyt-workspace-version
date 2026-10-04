import { Callout } from "@/components/ui/rail";
import { formatCompactMoney } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/oldpages/revenue/leakage-map-v2-first-build/v2-filters";
import type { OpportunityCell } from "@/services/api/opportunities/get-opportunities";

function groupOpportunitiesByStage(cells: OpportunityCell[]): { stage: string; cells: OpportunityCell[] }[] {
  const order: string[] = [];
  const byStage = new Map<string, OpportunityCell[]>();
  for (const cell of cells) {
    if (!byStage.has(cell.revenueStage)) {
      byStage.set(cell.revenueStage, []);
      order.push(cell.revenueStage);
    }
    byStage.get(cell.revenueStage)!.push(cell);
  }
  return order.map((stage) => ({ stage, cells: byStage.get(stage)! }));
}

function OpportunityRow({ cell }: { cell: OpportunityCell }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 first:border-t-0">
      <div className="min-w-0">
        <p className="text-[12.5px] font-medium text-ink">{humanizeEnum(cell.opportunityType)}</p>
        <p className="text-[11px] text-ink-3">
          {humanizeEnum(cell.subjectType)} · {cell.unit}
        </p>
      </div>

      {cell.state === "NO_OPPORTUNITY" && <span className="text-[12px] text-ink-3">No opportunity</span>}
      {cell.state === "UNKNOWN" && <span className="text-[11.5px] text-ink-4">Unknown</span>}

      {cell.state === "POPULATED" && cell.amounts.length === 0 && cell.candidateCount > 0 && (
        // Doc rule: an empty `amounts` with real candidates means evidence-backed but
        // deliberately unpriced — never invent a dollar figure to fill the gap.
        <span className="text-[12px] text-ink-3">{cell.candidateCount} candidates (unpriced)</span>
      )}

      {cell.state === "POPULATED" && cell.amounts.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {cell.amounts.map((amount, i) => (
            <p key={i} className="text-right text-[14px] font-semibold text-teal tabular-nums">
              +{formatCompactMoney(amount.grossPotential, amount.currency)}
            </p>
          ))}
          <p className="text-right text-[10.5px] text-ink-4">
            {cell.amounts
              .map((amount) => {
                const expected = amount.expectedGain != null ? `expected +${formatCompactMoney(amount.expectedGain, amount.currency)}` : null;
                return [humanizeEnum(amount.calibration), expected].filter(Boolean).join(" · ");
              })
              .join(" · ")}
            {cell.candidateCount > 0 && ` · ${cell.candidateCount} candidates`}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Phase 7's "missed opportunity" surface — see docs/leakage-map/v2-build-plan.md Step 5. A fully
 * separate panel from the leakage cell grid/rollups above: never combined, netted, or placed in the
 * same figure, per the handoff doc's explicit rule. Positive amounts (`+$X`) are a deliberate visual
 * cue that this is upside, not more leakage.
 */
export function OpportunitiesPanel({ cells, limitations }: { cells: OpportunityCell[]; limitations: string[] }) {
  if (cells.length === 0) return null;
  const stageGroups = groupOpportunitiesByStage(cells);

  return (
    <div className="rounded-card border border-line bg-paper">
      <div className="border-b border-line px-4 py-2.5">
        <p className="text-[12.5px] font-semibold text-ink">Missed opportunities</p>
        <p className="text-[10.5px] text-ink-3">
          Separate from leakage above: upside, never netted against it.
        </p>
      </div>
      {limitations.length > 0 && (
        <div className="border-b border-line px-4 py-2">
          <Callout tone="amber" title={`${limitations.length} limitation${limitations.length === 1 ? "" : "s"}`}>
            {limitations.map((l, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </Callout>
        </div>
      )}
      {stageGroups.map(({ stage, cells: stageCells }) => (
        <div key={stage}>
          <p className="border-t border-line bg-paper-2 px-4 py-1.5 font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase first:border-t-0">
            {humanizeEnum(stage)}
          </p>
          {stageCells.map((cell) => (
            <OpportunityRow key={cell.id} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}
