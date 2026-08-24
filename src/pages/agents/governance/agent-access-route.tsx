import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RevokeFieldModal } from "@/pages/agents/governance/modals/revoke-field-modal";
import { GV07_HERO, GV07_ROWS, GV_CHIP_TONE } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function SupportSignalAccess() {
  const [revokeOpen, setRevokeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Governance", to: "/governance/access" }, { label: "Support Signal · access" }]}
        title="Support Signal · access"
        subtitle="Six field decisions · one personal, two refused, and the reason for each"
        action={
          <Button type="button" onClick={() => setRevokeOpen(true)}>
            Revoke a field
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-amber-border bg-amber-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{GV07_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{GV07_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-2">{GV07_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{GV07_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{GV07_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-amber">{GV07_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it reads, field by field</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>Field</th>
                <th className={`${HEAD_CLASS} text-right`}>Personal?</th>
                <th className={HEAD_CLASS}>Why it needs it</th>
                <th className={`${HEAD_CLASS} text-right`}>Could it work without?</th>
              </tr>
            </thead>
            <tbody>
              {GV07_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-ink-2">{row.field}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.personalTone]}>{row.personal}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.withoutTone]}>{row.without}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Two fields are explicitly not granted and both were requested at some point">
        Agent notes were asked for in March to understand how tickets get resolved, and declined because they are
        about staff rather than customers. Names were never granted because the agent reasons about cohorts and
        does not need to know who anybody is. Both rows stay on the table so the decision is visible rather than
        forgotten.
      </Callout>

      <Callout tone="amber" title="The ticket body is the one thing in this workspace where a person's words are read by an agent">
        3,968 of them described the delivery fee. That reading is what produced the earliest correct signal about
        the ₦1.08B, four and a half months before anybody connected it. It is also the most intrusive thing any
        agent here does, and both facts belong on the same screen as the review date.
      </Callout>

      <p className="text-[11px] text-ink-4">
        <Link to="/governance/access" className="font-semibold text-ultra hover:underline">
          Back to Data access
        </Link>
      </p>

      <RevokeFieldModal open={revokeOpen} onOpenChange={setRevokeOpen} />
    </div>
  );
}

function AgentAccessNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Agent not found</p>
      <Link to="/governance/access" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Data access
      </Link>
    </div>
  );
}

/** GV07 (`su`) — the section's only built per-agent access page. */
const AgentAccessRoute = () => {
  const { id } = useParams();

  if (id === "su") return <SupportSignalAccess />;
  return <AgentAccessNotFound />;
};

export default AgentAccessRoute;
