import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { IdentityKvList } from "@/pages/data/identity/kv-list";
import { ID02_KV, ID02_STATS, ID_KPI_TONE } from "@/pages/data/identity/data";

/** ID02 — twelve December, the first identity rule set. Wired but unreachable with IDENTITY_STATE's current default. */
export function FirstRuleState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            One rule · 61,000 records merged · and the headline number fell
          </p>
        </div>
        <Button type="button" onClick={() => navigate("/identity/rule")}>
          See the rule
        </Button>
      </div>

      <div className="flex items-start gap-4 rounded-card border border-teal-border bg-teal-bg p-5">
        <PersonAvatar kind="human" initials="AD" team={1} />
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-ink">Ada set the rule and the customer count fell by 61,000 that afternoon</h2>
          <p className="mt-1.5 text-[11px] text-ink-2">
            Same verified email plus same market is one customer. Applying it merged 61,000 duplicate records that
            four dashboards had been counting twice since before Flolyt existed.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-teal">
            The old figure is kept. Every count in this product says which rule version produced it.
          </p>
        </div>
      </div>

      <KpiCards items={ID02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: ID_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the rule says</p>
        <IdentityKvList rows={ID02_KV} />
      </section>

      <Callout tone="ultra" title="Setting an identity rule always makes the headline number smaller">
        Four dashboards showed 4.22M and the true figure under a stated rule is 4.16M. Somebody has to explain a
        number going down for a reason that is an improvement, which is why the old figure and the rule version are
        kept on every count rather than quietly replaced.
      </Callout>
    </div>
  );
}
