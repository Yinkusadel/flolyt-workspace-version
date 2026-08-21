import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ReachabilityBar } from "@/pages/customers/segments/reachability-bar";
import { SegmentsTabs } from "@/pages/customers/segments/tabs";
import { SG05_BAR_ROWS, SG05_TERM_ROWS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG05 — /segments/reachability. */
const SegmentsReachabilityRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Reachability</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">520,100 people outside every audience the company can build</p>
        </div>
        <Button type="button" onClick={() => toast.success("Field request sent to data")}>
          Request the guest-checkout field
        </Button>
      </div>

      <SegmentsTabs active="Reachability" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The whole customer base, split by whether anybody could reach them</p>
        <ReachabilityBar rows={SG05_BAR_ROWS} />
      </section>

      <Callout tone="amber" title="Twelve per cent of the customer base cannot be reached, and a tenth of that is a schema gap">
        520,100 people are outside every audience the company can build. Most of it is correct — consent, dead
        channels and a suppression policy Ada set. The 42,000 guest-checkout customers are none of those things;
        they are people who bought something and left no way to be recognised. They appear in every count in this
        product and can be in no audience in it.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What reachability does and does not mean</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Term</th>
                <th className={HEAD_CLASS}>What it means here</th>
                <th className={`${HEAD_CLASS} text-right`}>Count</th>
                <th className={HEAD_CLASS}>Used for</th>
              </tr>
            </thead>
            <tbody>
              {SG05_TERM_ROWS.map((row) => (
                <tr key={row.term} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.term}</td>
                  <td className="px-4 py-3 text-ink-2">{row.meaning}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.count}</td>
                  <td className="px-4 py-3 text-ink-4">{row.usedFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Four different totals, and the largest one is the least useful">
        4.2M is the number on the website. 4,158,000 can be measured. 3,679,900 can be contacted. The gaps between
        them are where most reporting errors in this category live, so all four are on one screen with what each is
        allowed to be used for. The base figure is deliberately marked as good for nothing but counting.
      </Callout>
    </div>
  );
};

export default SegmentsReachabilityRoute;
