import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesHero } from "@/pages/data/data-sources/hero-banner";
import { DH07_TIMELINE_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH07 — the `checkout_events · 18 August` reference row. */
function CheckoutIncidentDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data health", to: "/data-health" }, { label: "checkout_events · 18 August" }]}
        title="checkout_events · 18 August"
        subtitle="Detected in two minutes · read by a person two hours later · nothing lost"
        action={
          <Button type="button" variant="outline" onClick={() => navigate("/data-health/backfill")}>
            See the backfill plan
          </Button>
        }
      />

      <DataSourcesHero
        tone="rose"
        kicker="checkout_events · stopped"
        value="6h 41m"
        desc="Detected at 04:14. Two funnel steps blank, one agent paused, nothing carried forward."
        statLabel="acknowledged"
        statValue="07:30"
        statSub="by Sam Iyer"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened, in order</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Time</th>
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {DH07_TIMELINE_ROWS.map((row, i) => (
                <tr key={`${row.time}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.time}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.whoTone]}`}>{row.who}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Detection took two minutes and the first person read it two hours later, in the digest">
        Nothing paged anybody at four in the morning, because a checkout stream being down for two hours is not
        worth waking somebody for and the product cannot tell the difference in advance between that and something
        worse. The digest at six was the mechanism, and it worked — the cost is two hours in which somebody looking
        at the funnel would have seen Unavailable without knowing why.
      </Callout>

      <Callout tone="teal" title="Nothing is lost, and that sentence is doing a lot of work">
        The rows are queued upstream, so when the stream returns they will arrive and the two funnel steps will
        recompute for the whole period. Today's figures will be marked as backfilled rather than silently
        completed, because a number that appeared six hours late should not be indistinguishable from one that was
        there all along.
      </Callout>
    </div>
  );
}

function IncidentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Incident not found</p>
      <Link to="/data-health/incidents" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to incidents
      </Link>
    </div>
  );
}

/** DH07 (`checkout`) — the section's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const IncidentDetailRoute = () => {
  const { id } = useParams();

  if (id === "checkout") return <CheckoutIncidentDetail />;
  return <IncidentNotFound />;
};

export default IncidentDetailRoute;
