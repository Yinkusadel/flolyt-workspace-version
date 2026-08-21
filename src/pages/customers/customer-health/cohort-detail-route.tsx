import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { BarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { HealthKvList } from "@/pages/customers/customer-health/kv-list";
import { HL06_BARS, HL06_KV_ROWS, HL_BAR_TONE } from "@/pages/customers/customer-health/data";

function LapsedFeeCohortDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Customer health", to: "/customer-health" }, { label: "Lapsed after the fee change" }]}
        title="Lapsed after the fee change"
        subtitle="Five signals, all worse · two of them were readable on 15 March"
        action={
          <Button type="button" onClick={() => toast.success("Opening room 8f2c")}>
            Open the room
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">In the cohort · reading five signals</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">100,000</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          Every signal is worse than the base, and one of them was worse eleven days before anybody noticed.
        </p>
        <div className="mt-3 border-t border-dashed border-rose-border pt-3">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">Support contact rate</p>
          <p className="mt-0.5 text-[13px] font-semibold text-rose">11.2% · against 2.9% base</p>
        </div>
      </div>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>The five signals, against the base</p>
        <div className="max-w-2xl space-y-3.5 rounded-card border border-line bg-paper p-4">
          {HL06_BARS.map((bar) => (
            <BarRow key={bar.label} label={bar.label} percent={bar.percent} tone={HL_BAR_TONE[bar.tone]} trailing={bar.sub} trailingTone={HL_BAR_TONE[bar.tone]} />
          ))}
        </div>
      </section>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12px] font-semibold text-ink">Two of these five signals were readable on 15 March and nobody was reading them</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          Support contact and discount use both moved within eleven days of the release, in a cohort that did not
          have a name until 2 August. The signals were not missing and the data was not missing. What was missing
          was anybody asking the question, which is what the leakage map now does automatically and this section
          does not.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this cohort is used for</p>
        <HealthKvList rows={HL06_KV_ROWS} />
      </section>

      <Link
        to="/customers/4118207"
        className="flex items-center justify-between gap-3 rounded-card border border-line bg-paper p-4 transition-colors hover:border-ink-4"
      >
        <div>
          <p className="text-[11.5px] font-semibold text-ultra">One identifiable person in this cohort</p>
          <p className="mt-1 text-[10.5px] text-ink-4">Customer 4,118,207 · five signals, read separately, no score</p>
        </div>
      </Link>
    </div>
  );
}

function CohortNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Cohort not found</p>
      <Link to="/customer-health?by=cohort" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to cohorts
      </Link>
    </div>
  );
}

/** HL06 (`lapsed-fee`) — the only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const CustomerHealthCohortDetailRoute = () => {
  const { id } = useParams();

  if (id === "lapsed-fee") return <LapsedFeeCohortDetail />;
  return <CohortNotFound />;
};

export default CustomerHealthCohortDetailRoute;
