import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { RETAIN_OVERLAP_ROWS, RETAIN_SEGMENT_ROWS, type RetainOverlapRow, type RetainSegmentRow } from "@/pages/lifecycle/stage/retain/data";

const REPEAT_RATE_TONE_CLASS: Record<RetainSegmentRow["repeatRateTone"], string> = { teal: "text-teal", rose: "text-rose" };
const VS_BASE_TONE_CLASS: Record<RetainSegmentRow["vsBaseTone"], string> = { teal: "text-teal", rose: "text-rose" };
const REACHABLE_TONE_CLASS: Record<RetainSegmentRow["reachableTone"], string> = { teal: "text-teal", rose: "text-rose" };
const AT_STAKE_TONE_CLASS: Record<RetainSegmentRow["atStakeTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const OVERLAP_TONE_CLASS: Record<RetainOverlapRow["tone"], string> = { amber: "text-amber", rose: "text-rose", muted: "text-ink-4", ink: "text-ink-2" };

const COLUMNS: Column<RetainSegmentRow>[] = [
  { key: "segment", header: "Segment", render: (row) => <span className="font-semibold text-ink-2">{row.segment}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "repeatRate", header: "Repeat rate", align: "right", render: (row) => <span className={REPEAT_RATE_TONE_CLASS[row.repeatRateTone]}>{row.repeatRate}</span> },
  { key: "vsBase", header: "vs base", align: "right", render: (row) => <span className={VS_BASE_TONE_CLASS[row.vsBaseTone]}>{row.vsBase}</span> },
  { key: "reachable", header: "Reachable", align: "right", render: (row) => <span className={REACHABLE_TONE_CLASS[row.reachableTone]}>{row.reachable}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={AT_STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** RT04 — Retain's unique Segments tab. */
const RetainSegmentsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={RETAIN_SEGMENT_ROWS} />

      <Callout tone="rose" title="Every segment on this table was decided in a different stage">
        Delivery outcome is Support. Feature depth is Adopt. Guest checkout is Activate. Discount is Price. Referral
        is Advocate. Retain owns the number and owns none of the levers — which is the clearest single illustration
        of why the ten stages sit on one page.
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Segments that overlap, and the double-count that would follow</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {RETAIN_OVERLAP_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${OVERLAP_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RetainSegmentsTab;
