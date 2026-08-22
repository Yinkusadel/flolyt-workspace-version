import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AgentBuilderTabs } from "@/pages/agents/agent-builder/tabs";
import { AgentBuilderKvList } from "@/pages/agents/agent-builder/kv-list";
import { AB02_BANNER, AB02_KV, AB02_STATS, AB_KPI_TONE } from "@/pages/agents/agent-builder/data";

/** AB02 — the first built agent, awaiting approval. Wired but unreachable with AGENT_BUILDER_STATE's current default. */
export function FirstBuiltState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Agent Builder</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 built · this morning · awaiting approval</p>
      </div>

      <AgentBuilderTabs active="Built here" />

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials="IN" team={2} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">{AB02_BANNER.heading}</p>
            <p className="mt-1.5 text-[11px] text-ink-2">{AB02_BANNER.body}</p>
            <p className="mt-1.5 text-[11px] font-semibold text-ultra">{AB02_BANNER.highlight}</p>
          </div>
        </div>
      </div>

      <KpiCards items={AB02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AB_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it does, in the terms this product uses</p>
        <AgentBuilderKvList rows={AB02_KV} />
      </section>

      <Callout tone="ultra" title="An agent built in eleven minutes covers a gap that has been open since June">
        The condition existed inside Repeat & Decay, correctly written, routing nowhere. What Ifeoma built is not
        cleverer than the agent that suggested it — it is the same rule with a person's name attached to the
        destination, which is the part no agent could supply.
      </Callout>

      <Button type="button" onClick={() => toast.success("Message sent to Ada")}>
        Ask Ada to activate it
      </Button>
    </div>
  );
}
