import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import ActivateCohortsTab from "@/pages/lifecycle/stage/activate/cohorts-tab";
import PriceCohortsTab from "@/pages/lifecycle/stage/price/cohorts-tab";
import AdoptCohortsTab from "@/pages/lifecycle/stage/adopt/cohorts-tab";
import RetainCohortsTab from "@/pages/lifecycle/stage/retain/cohorts-tab";
import ExpandCohortsTab from "@/pages/lifecycle/stage/expand/cohorts-tab";
import SupportCohortsTab from "@/pages/lifecycle/stage/support/cohorts-tab";
import RenewCohortsTab from "@/pages/lifecycle/stage/renew/cohorts-tab";
import AdvocateCohortsTab from "@/pages/lifecycle/stage/advocate/cohorts-tab";
import ChurnCohortsTab from "@/pages/lifecycle/stage/churn/cohorts-tab";
import {
  ACQUIRE_COHORT_BREAK_ROWS,
  ACQUIRE_COHORT_ROWS,
  type CohortRow,
} from "@/pages/lifecycle/stage/acquire/data";
import type { BarTone } from "@/pages/lifecycle/stage/bar";

type CohortsData = {
  eyebrow: string;
  rows: CohortRow[];
  footnoteTitle: string;
  footnoteBody: string;
  breakEyebrow: string;
  breakRows: { label: string; value: string; percent: number; tone: BarTone }[];
  insightTitle: string;
  insightBody: string;
};

const COHORTS_DATA: Record<string, CohortsData> = {
  acquire: {
    eyebrow: "Every acquisition cohort, measured at the same ages",
    rows: ACQUIRE_COHORT_ROWS,
    footnoteTitle: "June has no 90-day figure and it is left blank",
    footnoteBody:
      "The cohort is 61 days old. Filling it with a projection would put an estimate in the same column as five measurements, and the column would stop meaning one thing.",
    breakEyebrow: "The break is dated, not gradual",
    breakRows: ACQUIRE_COHORT_BREAK_ROWS,
    insightTitle: "Cost per customer rose 35% in the same quarter the customer became worth 29% less",
    insightBody:
      "CAC went from ₦1,466 to ₦1,988 while value per customer fell from ₦9,200 to ₦6,600. Acquisition did not get worse at its job — it got more expensive at a job whose output was being damaged three stages downstream.",
  },
};

const VALUE_TONE_CLASS: Record<CohortRow["valueTone"], string> = {
  teal: "text-teal",
  rose: "text-rose",
  neutral: "text-ink-4",
};

const COLUMNS: Column<CohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "cac", header: "CAC", align: "right", render: (row) => <span className="font-mono text-ink">{row.cac}</span> },
  { key: "day30", header: "30 day", align: "right", render: (row) => <span className="font-mono text-ink">{row.day30}</span> },
  { key: "day60", header: "60 day", align: "right", render: (row) => <span className="font-mono text-ink">{row.day60}</span> },
  { key: "day90", header: "90 day", align: "right", render: (row) => <span className={row.day90 === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.day90}</span> },
  {
    key: "valuePerCustomer",
    header: "Value per customer",
    align: "right",
    render: (row) => <span className={VALUE_TONE_CLASS[row.valueTone]}>{row.valuePerCustomer}</span>,
  },
  {
    key: "vsFeb",
    header: "vs Feb",
    align: "right",
    render: (row) => <span className={VALUE_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span>,
  },
];

/** Screen 06 in the export naming (e.g. A06) — the shared Cohorts tab template for every stage. */
export function CohortsTab() {
  const { stage } = useStageContext();

  // Activate's Cohorts screen (AC06) uses a different column set (activation
  // rate/guest share, not CAC/day30-90) — routed to its own component rather
  // than forcing this template's Acquire-shaped columns onto it.
  if (stage.slug === "activate") return <ActivateCohortsTab />;
  // Price's PR07 uses revenue/discount/plan-mix columns, not CAC/day30-90.
  if (stage.slug === "price") return <PriceCohortsTab />;
  // Adopt's AD07 uses eligible/2+features/scheduled-delivery columns, not CAC/day30-90.
  if (stage.slug === "adopt") return <AdoptCohortsTab />;
  // Retain's RT07 uses 30/60/90-day repeat-rate + median-days columns, not CAC/day30-90.
  if (stage.slug === "retain") return <RetainCohortsTab />;
  // Expand's EX07 uses expansion-rate/ARPU-multiple/on-a-paid-plan columns, not CAC/day30-90.
  if (stage.slug === "expand") return <ExpandCohortsTab />;
  // Support's SU06 uses contact-rate/top-driver/repeat-after-contact columns, not CAC/day30-90.
  if (stage.slug === "support") return <SupportCohortsTab />;
  // Renew's RN06 uses cancelled/paused/card-failed columns, not CAC/day30-90.
  if (stage.slug === "renew") return <RenewCohortsTab />;
  // Advocate's AV06 uses reached-180-days/referred-anyone/referrals-each columns, not CAC/day30-90.
  if (stage.slug === "advocate") return <AdvocateCohortsTab />;
  // Churn's CH06 uses churned-by-180d/never-activated/median-days-alive columns, not CAC/day30-90.
  if (stage.slug === "churn") return <ChurnCohortsTab />;

  const data = COHORTS_DATA[stage.slug];
  if (!data) return null;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.eyebrow}</p>
        <DataTable columns={COLUMNS} rows={data.rows} />
      </section>

      <Callout tone="neutral" title={data.footnoteTitle}>
        {data.footnoteBody}
      </Callout>

      <section className="space-y-5">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.breakEyebrow}</p>
        <div className="space-y-5">
          {data.breakRows.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title={data.insightTitle}>
        {data.insightBody}
      </Callout>
    </div>
  );
}
