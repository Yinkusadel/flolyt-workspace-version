import { Link, useParams } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AB12_HERO, AB12_ROWS, AGENT_BUILDER_DETAIL_TITLES, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function DataIntegrityDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Agent Builder", to: "/agent-builder" }, { label: AGENT_BUILDER_DETAIL_TITLES["data-integrity"] }]}
        title={AGENT_BUILDER_DETAIL_TITLES["data-integrity"]}
        subtitle="Six findings, all constraints, all still true · and it wrote most of business memory's spine"
      />

      <div className="relative overflow-hidden rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AB12_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{AB12_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-2">{AB12_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AB12_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{AB12_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-teal">{AB12_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it has found, and what happened</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Finding</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Claim</th>
                <th className={HEAD_CLASS}>What it became</th>
                <th className={`${HEAD_CLASS} text-right`}>Still true</th>
              </tr>
            </thead>
            <tbody>
              {AB12_ROWS.map((row) => (
                <tr key={row.finding} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.finding}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.whenTone]}`}>{row.when}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="teal">{row.claim}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.became}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.stillTrueTone]}`}>{row.stillTrue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The least glamorous agent in the workspace wrote every constraint anybody cites">
        Six findings, all of them constraints, none of them about a customer. They are why Price & Margin is
        paused rather than estimating, why the funnel shows gaps rather than curves, and why a playbook refuses
        Ghana. An agent that only ever says what cannot be computed turns out to be load-bearing for everything
        that can.
      </Callout>

      <Callout tone="rose" title="It is the only agent here whose findings all remain true">
        Every one of the six is still an accurate description of this workspace, and four have been true for more
        than seven months. That is not a compliment to the agent — it is a fact about a queue of engineering
        work, and Data Integrity is the only thing in the product that keeps saying so nightly.
      </Callout>

      <p className="text-[11px] text-ink-4">
        <Link to="/business-memory" className="font-semibold text-ultra hover:underline">
          See the constraints
        </Link>
      </p>
    </div>
  );
}

function AgentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Agent not found</p>
      <Link to="/agent-builder" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Agent Builder
      </Link>
    </div>
  );
}

/** AB12 (`data-integrity`) — the section's only built agent detail page. */
const AgentDetailRoute = () => {
  const { id } = useParams();

  if (id === "data-integrity") return <DataIntegrityDetail />;
  return <AgentNotFound />;
};

export default AgentDetailRoute;
