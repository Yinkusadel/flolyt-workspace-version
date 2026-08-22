import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GV11_ROWS, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV11 — /governance/reviews. */
const ReviewsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Reviews</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five reviews · one found nothing and is listed anyway · one agent overdue since March</p>
        </div>
        <Button type="button" onClick={() => toast.success("Review started")}>
          Start a review
        </Button>
      </div>

      <GovernanceTabs active="Reviews" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Access reviews · what was looked at and what changed</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Review</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Agents</th>
                <th className={`${HEAD_CLASS} text-right`}>Changed</th>
                <th className={HEAD_CLASS}>What was found</th>
                <th className={`${HEAD_CLASS} text-right`}>By</th>
              </tr>
            </thead>
            <tbody>
              {GV11_ROWS.map((row) => (
                <tr key={row.review + row.when} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.review}</td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.whenTone]}`}>{row.when}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.agents}</td>
                  <td className={`px-4 py-3 text-right font-mono ${GV_TONE_CLASS[row.changedTone]}`}>{row.changed}</td>
                  <td className="px-4 py-3 text-ink-3">{row.found}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The June review removed two fields nobody had noticed were still granted">
        Repeat & Decay had access to a discount column from a room that closed in February, and Expansion could
        read a plan field it stopped using in April. Neither was misused and both were revoked. Access granted for
        a reason that has since ended is the most common finding in every review here, and it is the reason the
        reviews are scheduled rather than triggered.
      </Callout>

      <Callout tone="teal" title="One review found nothing and it is on the list at the same weight as the ones that found something">
        After the 14 August resend, Ada reviewed the three agents involved and changed nothing, because a hold
        list enforced in the wrong place is not an access problem. A review log that only recorded changes would
        make it look as though every review finds something, and would quietly discourage running the ones that
        will not.
      </Callout>
    </div>
  );
};

export default ReviewsRoute;
