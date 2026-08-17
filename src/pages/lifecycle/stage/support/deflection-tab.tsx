import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  SUPPORT_DEFLECTION_KPIS,
  SUPPORT_DEFLECTION_ROWS,
  type DeflectionRow,
} from "@/pages/lifecycle/stage/support/data";

const REPEAT_TONE_CLASS: Record<DeflectionRow["repeatRateAfterTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const VS_HUMAN_TONE_CLASS: Record<DeflectionRow["vsHumanTone"], string> = { teal: "text-teal", rose: "text-rose" };

const COLUMNS: Column<DeflectionRow>[] = [
  { key: "deflectedBy", header: "Deflected by", render: (row) => <span className="font-semibold text-ink-2">{row.deflectedBy}</span> },
  { key: "contactsPerMo", header: "Contacts / mo", align: "right", render: (row) => <span className="font-mono text-ink">{row.contactsPerMo}</span> },
  { key: "costSaved", header: "Cost saved", align: "right", render: (row) => <span className="text-teal">{row.costSaved}</span> },
  { key: "repeatRateAfter", header: "Repeat rate after", align: "right", render: (row) => <span className={REPEAT_TONE_CLASS[row.repeatRateAfterTone]}>{row.repeatRateAfter}</span> },
  { key: "vsHuman", header: "vs contacting a human", align: "right", render: (row) => <span className={VS_HUMAN_TONE_CLASS[row.vsHumanTone]}>{row.vsHuman}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** SU05 — Support's unique Deflection tab. */
const SupportDeflectionTab = () => {
  return (
    <div className="space-y-8">
      <KpiCards items={SUPPORT_DEFLECTION_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Deflection, measured on cost and on revenue</p>
        <DataTable columns={COLUMNS} rows={SUPPORT_DEFLECTION_ROWS} />
      </section>

      <Callout tone="rose" title="Two of these save money and cost more than they save">
        The fee article and the refund chatbot deflect successfully and the customer leaves anyway — 5 and 9 points
        below the people who spoke to a human about the same thing. ₦6.4M saved in handling cost against ₦12M of
        lost revenue. No support dashboard in this company reports the second number.
      </Callout>

      <Callout tone="amber" title="The last row is not deflection and should never have been counted as it">
        2,300 customers a month give up before reaching anyone and are recorded as deflected. They retain at 8.1%.
        Counting abandonment as a success is the single clearest measurement error this stage inherited, and it is
        stated rather than quietly corrected.
      </Callout>
    </div>
  );
};

export default SupportDeflectionTab;
