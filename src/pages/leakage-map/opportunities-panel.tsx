import { Chip } from "@/components/ui/chip";
import { Callout } from "@/components/ui/rail";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { OpportunityCell } from "@/services/api/opportunities/get-opportunities";

/** Same "no label field, just a raw key" situation as leakage rollups — cosmetic only. */
function humanizeKey(value: string): string {
  return value
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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
        <p className="text-[12.5px] font-medium text-ink">{humanizeKey(cell.opportunityType)}</p>
        <p className="text-[11px] text-ink-3">
          {humanizeKey(cell.subjectType)} · {cell.unit}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {cell.state === "NO_OPPORTUNITY" && <span className="text-[12px] text-ink-3">No opportunity</span>}
        {cell.state === "UNKNOWN" && <span className="text-[11.5px] text-ink-4">Unknown</span>}

        {cell.state === "POPULATED" && cell.amounts.length === 0 && cell.candidateCount > 0 && (
          // Doc rule: an empty `amounts` with real candidates means evidence-backed but
          // deliberately unpriced — never invent a dollar figure to fill the gap.
          <span className="text-[12px] text-ink-3">{cell.candidateCount} candidates (unpriced)</span>
        )}

        {cell.state === "POPULATED" &&
          cell.amounts.map((amount, i) => (
            <div key={i} className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-semibold text-teal">
                +{formatCompactMoney(amount.grossPotential, amount.currency)}
              </span>
              {amount.expectedGain != null && (
                <span className="text-[10.5px] text-ink-4">
                  (expected +{formatCompactMoney(amount.expectedGain, amount.currency)})
                </span>
              )}
              <Chip tone="neutral">{amount.calibration.toLowerCase()}</Chip>
            </div>
          ))}

        {cell.candidateCount > 0 && cell.amounts.length > 0 && (
          <Chip tone="neutral">{cell.candidateCount} candidates</Chip>
        )}
      </div>
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
          Separate from leakage above — upside, never netted against it.
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
            {humanizeKey(stage)}
          </p>
          {stageCells.map((cell) => (
            <OpportunityRow key={cell.id} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}
