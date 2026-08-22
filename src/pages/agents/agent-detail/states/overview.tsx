import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailTabs } from "@/pages/agents/agent-detail/tabs";
import { AgentDetailKvList } from "@/pages/agents/agent-detail/kv-list";
import { AN02_KV, AN02_STATS, AN02_SUBTITLE, AN16_QUARTER, AN_KPI_TONE } from "@/pages/agents/agent-detail/data";

/** AN02 — the default "Overview" state, with AN16's quarter summary folded in. */
export function OverviewState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <AgentHeader subtitle={AN02_SUBTITLE} />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link to="/settings/agent-detail" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Settings
          </Link>
          <Button asChild type="button" variant="outline" size="sm">
            <Link to="/agent-detail/limits">What it will not do</Link>
          </Button>
          <Button asChild type="button" size="sm">
            <Link to="/agent-detail/conditions">See what it watches</Link>
          </Button>
        </div>
      </div>

      <AgentDetailTabs active="Overview" />

      <KpiCards items={AN02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AN_KPI_TONE[s.tone], href: s.href }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it has actually done here</p>
        <AgentDetailKvList rows={AN02_KV} />
      </section>

      <Callout tone="rose" title="This is the most trusted agent in the workspace and two of its nineteen claims have been tested">
        It opened the room that connected ₦1.08B across ten stages, and seventeen of the things it has said have
        never been checked against anything. Trust here is a reputation built from one spectacular result and a
        lot of unfalsified assertions, which is worth remembering on a screen that would otherwise read as a
        performance review.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>This quarter, at a glance</p>
        <AgentDetailKvList rows={AN16_QUARTER.map((q) => ({ label: q.label, value: `${q.value} · ${q.note}`, tone: q.tone }))} />
      </section>
    </div>
  );
}
