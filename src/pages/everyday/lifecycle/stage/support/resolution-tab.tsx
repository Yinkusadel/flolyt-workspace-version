import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  SUPPORT_RESOLUTION_KPIS,
  SUPPORT_RESOLUTION_ROWS,
  type ResolutionRow,
} from "@/pages/everyday/lifecycle/stage/support/data";

const RESOLVED_FAST_TONE_CLASS: Record<ResolutionRow["resolvedFastTone"], string> = { teal: "text-teal", amber: "text-amber" };
const SATISFIED_TONE_CLASS: Record<ResolutionRow["customerSatisfiedTone"], string> = { teal: "text-teal", amber: "text-amber" };
const REPEAT_TONE_CLASS: Record<ResolutionRow["repeatRateAfterTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<ResolutionRow>[] = [
  { key: "resolutionType", header: "Resolution type", render: (row) => <span className="font-semibold text-ink-2">{row.resolutionType}</span> },
  { key: "ticketsPerMo", header: "Tickets / mo", align: "right", render: (row) => <span className="font-mono text-ink">{row.ticketsPerMo}</span> },
  { key: "resolvedFast", header: "Resolved fast", align: "right", render: (row) => <span className={RESOLVED_FAST_TONE_CLASS[row.resolvedFastTone]}>{row.resolvedFast}</span> },
  { key: "customerSatisfied", header: "Customer satisfied", align: "right", render: (row) => <span className={SATISFIED_TONE_CLASS[row.customerSatisfiedTone]}>{row.customerSatisfied}</span> },
  { key: "repeatRateAfter", header: "Repeat rate after", align: "right", render: (row) => <span className={REPEAT_TONE_CLASS[row.repeatRateAfterTone]}>{row.repeatRateAfter}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** SU04 — Support's unique Resolution tab. */
const SupportResolutionTab = () => {
  return (
    <div className="space-y-8">
      <KpiCards items={SUPPORT_RESOLUTION_KPIS} />

      <Callout tone="rose" title="Support got faster at everything and the customers still left">
        First-contact resolution rose 6.7 points and median time fell by two thirds. Retention after contact fell
        anyway, because the thing customers were contacting about was not fixed by the conversation — it was fixed,
        eventually, by a release in August.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Resolution quality against what happened next</p>
        <DataTable columns={COLUMNS} rows={SUPPORT_RESOLUTION_ROWS} />
      </section>

      <Callout tone="rose" title="Satisfied and gone is the most important pattern on this screen">
        24,500 customers a month rate their support experience positively and then do not come back. Every support
        metric in the company reports these as successes. They are successes — the agent did their job. The
        customer&apos;s problem was the fee, and no conversation was ever going to fix that.
      </Callout>
    </div>
  );
};

export default SupportResolutionTab;
