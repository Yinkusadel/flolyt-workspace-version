import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AttributionBars } from "@/pages/revenue/attribution/bars";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AT04_BARS, AT04_GHANA_ROW, AT04_KV_ROWS, AT04_STATS, AT_KPI_TONE } from "@/pages/revenue/attribution/data";

function RetryCardsDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Attribution", to: "/attribution" }, { label: "Retry cards at 09:00 local" }]}
        title="Retry cards at 09:00 local"
        subtitle="₦62M against a 10% holdout · nine days · and what the holdout cost"
        action={
          <Button type="button" variant="outline" onClick={() => toast.info("Opening the reuse workflow")}>
            Reuse in another market
          </Button>
        }
      />

      <KpiCards items={AT04_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: s.tone ? AT_KPI_TONE[s.tone] : "ink" }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Treated against held</p>
        <div className="max-w-2xl">
          <AttributionBars rows={AT04_BARS} />
        </div>
        <p className="text-[10.5px] text-ink-4">{AT04_GHANA_ROW}</p>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What was written down before it ran</p>
        <div className="max-w-2xl">
          <AttributionKvList rows={AT04_KV_ROWS} />
        </div>
      </section>

      <Callout tone="amber" title="The holdout cost 2,140 people a working payment and ₦6.9M, and that is on the page">
        A holdout is not free. Those customers were left on a retry pattern already known to be worse so that the
        other 19,260 could be measured against something. It is defensible and it is a cost, and it appears next
        to the ₦62M rather than in a methods appendix — because the next person designing a holdout should be
        looking at both numbers.
      </Callout>
    </div>
  );
}

function InterventionNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Intervention not found</p>
      <Link to="/attribution" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to attribution
      </Link>
    </div>
  );
}

/** AT04 (`retry-0900`) — the section's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const InterventionDetailRoute = () => {
  const { id } = useParams();

  if (id === "retry-0900") return <RetryCardsDetail />;
  return <InterventionNotFound />;
};

export default InterventionDetailRoute;
