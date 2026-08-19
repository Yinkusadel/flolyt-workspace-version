import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  RENEW_COHORT_ATTRIBUTION_ROWS,
  RENEW_COHORT_CLOSING,
  RENEW_COHORT_ROWS,
  type RenewCohortRow,
} from "@/pages/everyday/lifecycle/stage/renew/data";

const RATE_TONE_CLASS: Record<RenewCohortRow["rateTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const CANCELLED_TONE_CLASS: Record<RenewCohortRow["cancelledTone"], string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4" };
const PAUSED_TONE_CLASS: Record<RenewCohortRow["pausedTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const CARD_FAILED_TONE_CLASS: Record<RenewCohortRow["cardFailedTone"], string> = { teal: "text-teal", neutral: "text-ink-4" };
const VS_FEB_TONE_CLASS: Record<RenewCohortRow["vsFebTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<RenewCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "renewing", header: "Renewing", align: "right", render: (row) => <span className="font-mono text-ink">{row.renewing}</span> },
  { key: "renewed", header: "Renewed", align: "right", render: (row) => <span className={row.renewed === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.renewed}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "cancelled", header: "Cancelled", align: "right", render: (row) => <span className={CANCELLED_TONE_CLASS[row.cancelledTone]}>{row.cancelled}</span> },
  { key: "paused", header: "Paused", align: "right", render: (row) => <span className={PAUSED_TONE_CLASS[row.pausedTone]}>{row.paused}</span> },
  { key: "cardFailed", header: "Card failed", align: "right", render: (row) => <span className={CARD_FAILED_TONE_CLASS[row.cardFailedTone]}>{row.cardFailed}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * RN06 — Renew's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — RN06 breaks renewal outcome down by cancelled/
 * paused/card-failed columns, not Acquire's CAC/day30-90, confirmed by
 * reading RN06 directly).
 */
const RenewCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Renewal outcome by the cohort a customer was acquired in</p>
        <DataTable columns={COLUMNS} rows={RENEW_COHORT_ROWS} />
      </section>

      <Callout tone="ultra" title={RENEW_COHORT_CLOSING.title}>
        {RENEW_COHORT_CLOSING.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>The −3.2 points, attributed</p>
        <div className="space-y-5">
          {RENEW_COHORT_ATTRIBUTION_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RenewCohortsTab;
