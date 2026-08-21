import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { HealthTabs } from "@/pages/customers/customer-health/tabs";
import { HL05_COHORT_ROWS, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL05 — /customer-health?by=cohort. */
export function ByCohortState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Customer health</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six cohorts × five signals · one cohort reads Unavailable on every column</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening a room from a cohort")}>
          Open a room
        </Button>
      </div>

      <HealthTabs active="By cohort" />

      <Link
        to="/customer-health/unowned"
        className="flex items-center justify-between gap-3 rounded-card border border-rose-border bg-rose-bg p-4 transition-colors hover:border-rose"
      >
        <div>
          <p className="text-[12px] font-semibold text-ink">3 of 7 badly-reading cohorts have no owner to hand them to</p>
          <p className="mt-1 text-[10.5px] text-rose">254,000 people · 47 agent findings routed to an empty field</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-rose" aria-hidden />
      </Link>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every signal, read across the cohorts that have a name</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Cohort</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={`${HEAD_CLASS} text-right`}>Feature depth</th>
                <th className={`${HEAD_CLASS} text-right`}>2nd order</th>
                <th className={`${HEAD_CLASS} text-right`}>Card failures</th>
                <th className={`${HEAD_CLASS} text-right`}>Support contact</th>
                <th className={`${HEAD_CLASS} text-right`}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {HL05_COHORT_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <Link to={`/customer-health/${row.id}`} className="text-ultra hover:underline">
                      {row.cohort}
                    </Link>
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", HL_TONE_CLASS[row.peopleTone])}>{row.people}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", HL_TONE_CLASS[row.featureDepthTone])}>{row.featureDepth}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", HL_TONE_CLASS[row.secondOrderTone])}>{row.secondOrder}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", HL_TONE_CLASS[row.cardFailuresTone])}>{row.cardFailures}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", HL_TONE_CLASS[row.supportContactTone])}>{row.supportContact}</td>
                  <td className={cn("px-4 py-3 text-right", HL_TONE_CLASS[row.ownerTone])}>{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Paid social is worse on every signal and it is not obviously a problem">
        Lower depth, fewer second orders, more card failures and more support contacts, across 211,000 people. That
        could be a channel bringing in worse customers or a channel bringing in customers who are handled worse
        after they arrive. The signals cannot tell those apart, and the row is presented without a verdict for that
        reason.
      </Callout>

      <Callout tone="rose" title="The lapsed cohort contacts support four times as often as anyone else">
        11.2% of the 100,000 people who stopped ordering after 4 March wrote in first. They told the company what
        was wrong before they left, in a channel that recorded it as a delivery complaint. That figure is the
        cheapest early-warning signal in this table and it took a leakage map, a funnel and five months to notice.
      </Callout>
    </div>
  );
}
