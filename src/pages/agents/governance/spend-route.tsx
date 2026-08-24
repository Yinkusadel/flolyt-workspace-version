import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GovernanceKvList } from "@/pages/agents/governance/kv-list";
import { SetCapModal } from "@/pages/agents/governance/modals/set-cap-modal";
import { GV09_BARS, GV09_KV, GV09_STATS, GV_BAR_TONE, GV_KPI_TONE } from "@/pages/agents/governance/data";

/** GV09 — /governance/spend. */
const SpendRoute = () => {
  const [capOpen, setCapOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Spend</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">₦7,590 of a ₦12,000 budget · and the budget is a tripwire rather than a cost control</p>
        </div>
        <Button type="button" onClick={() => setCapOpen(true)}>
          Set a cap
        </Button>
      </div>

      <GovernanceTabs active="Spend" />

      <KpiCards items={GV09_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: GV_KPI_TONE[s.tone], href: s.href }))} />

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>Where it goes</p>
        <div className="max-w-3xl space-y-4">
          {GV09_BARS.map((bar) => (
            <WideBarRow key={bar.label} label={bar.label} value={bar.value} percent={bar.percent} tone={GV_BAR_TONE[bar.tone]} />
          ))}
        </div>
      </section>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12.5px] font-semibold text-ink">
          The two most expensive agents after Repeat & Decay have opened no rooms between them
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-rose">
          Product Reason and Churn Reason cost ₦2,020 a month to produce thirty-six findings that arrive at two
          empty fields. That is not an argument for switching them off — the findings are correct and the stages
          need owners — but it is the clearest way to price the cost of an unowned stage, and it appears in exactly
          one place in this product.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The budget, and what it is actually for</p>
        <GovernanceKvList rows={GV09_KV} />
      </section>

      <SetCapModal open={capOpen} onOpenChange={setCapOpen} />
    </div>
  );
};

export default SpendRoute;
