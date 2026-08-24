import { Link, useParams } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesHero } from "@/pages/data/data-sources/hero-banner";
import { ID11_TIMELINE_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID11 — the section's one incident, at the export's own literal `/data/identity/incidents/1` slug. */
function FalseMergeDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Identity", to: "/identity" }, { label: "A false merge" }]}
        title="A false merge"
        subtitle="Nine days · caught by a customer, not a check · reversed and turned into a rule"
      />

      <DataSourcesHero
        tone="rose"
        kicker="found after"
        value="9 days"
        desc="Two different people were merged on a reassigned phone number. One had opted out; the other had not."
        statLabel="reversed"
        statValue="same day"
        statSub="and what it touched, restated"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {ID11_TIMELINE_ROWS.map((row, i) => (
                <tr key={`${row.when}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The only thing that caught this was a customer writing in">
        No check catches a false merge. The record was internally consistent, the consent state resolved correctly
        under the merge rule, and every figure computed from it was arithmetically right. A person received a
        message about somebody else's order and said so, nine days later.
      </Callout>

      <Callout tone="teal" title="It produced the constraint that now prevents the same merge">
        Phone-only matching is no longer offered as a manual merge suggestion, and the reason is written in
        business memory where the next person considering a bulk phone merge will find it. One reversed merge, one
        send to the wrong person, and a rule that has held since.
      </Callout>
    </div>
  );
}

function IncidentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Incident not found</p>
      <Link to="/identity" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to identity
      </Link>
    </div>
  );
}

/** ID11 (`1`) — the section's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const FalseMergeRoute = () => {
  const { id } = useParams();

  if (id === "1") return <FalseMergeDetail />;
  return <IncidentNotFound />;
};

export default FalseMergeRoute;
