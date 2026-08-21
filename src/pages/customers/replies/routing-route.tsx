import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { RepliesTabs } from "@/pages/customers/replies/tabs";
import { RepliesKvList } from "@/pages/customers/replies/kv-list";
import { RP07_KV_ROWS, RP07_ROWS, RP_TONE_CLASS } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RP07 — /replies/routing. */
const RepliesRoutingRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Routing</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five rules in order · rule four is the routing gap, arriving as 768 people</p>
        </div>
        <Button type="button" onClick={() => toast.info("768 messages route to Adopt and Advocate, which have no owner")}>
          See the routing gap
        </Button>
      </div>

      <RepliesTabs active="Routing" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where a reply goes, decided in this order</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Rule</th>
                <th className={HEAD_CLASS}>What it catches</th>
                <th className={`${HEAD_CLASS} text-right`}>This month</th>
                <th className={HEAD_CLASS}>Goes to</th>
                <th className={`${HEAD_CLASS} text-right`}>If nobody is there</th>
              </tr>
            </thead>
            <tbody>
              {RP07_ROWS.map((row) => (
                <tr key={row.rule} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whatItCatches}</td>
                  <td className={`px-4 py-3 text-right font-mono ${RP_TONE_CLASS[row.thisMonthTone]}`}>{row.thisMonth}</td>
                  <td className="px-4 py-3 text-ink-4">{row.goesTo}</td>
                  <td className={`px-4 py-3 text-right ${RP_TONE_CLASS[row.ifNobodyTone]}`}>{row.ifNobody}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Rule four is the routing gap, arriving in this section as people">
        The twelve cross-stage conditions with no destination have a counterpart here: 768 messages about features
        and onboarding that route to stage owners, two of whom do not exist. Everywhere else in the product an
        unrouted item is a finding sitting in a queue. Here it is somebody who wrote to a company and got nothing
        back.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What routing deliberately does not do</p>
        <RepliesKvList rows={RP07_KV_ROWS} />
      </section>

      <Callout tone="amber" title="Sending everything unowned to Amara would clear this screen and break Support">
        Support handles 2,436 unclassified messages a month and would absorb another 768 without complaining. It
        is not offered, because a queue that quietly becomes Support's queue is how the company stops noticing that
        two stages have nobody in them.
      </Callout>
    </div>
  );
};

export default RepliesRoutingRoute;
