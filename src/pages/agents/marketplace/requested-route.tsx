import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MarketplaceTabs } from "@/pages/agents/marketplace/tabs";
import { MK10_ROWS, MK_CHIP_TONE } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK10 — /marketplace/requested. */
const RequestedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Requested</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four requests · one in review, one rejected, and what publishing actually sends</p>
        </div>
        <Button type="button" size="sm" onClick={() => toast.info("Listing requests go through Agent Builder")}>
          Request a listing
        </Button>
      </div>

      <MarketplaceTabs active="Requested" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Agents this workspace has asked to be listed, or asked for</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={`${HEAD_CLASS} text-right`}>Kind</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
                <th className={HEAD_CLASS}>What happened</th>
                <th className={`${HEAD_CLASS} text-right`}>Named</th>
              </tr>
            </thead>
            <tbody>
              {MK10_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={MK_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.asked}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={MK_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.happened}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.named}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Publishing Release Watch means publishing a rule, not what it found here">
        What would be listed is the pattern — a release shipping into a market with a prior loss — its
        preconditions, and its claim ceiling. Not Ghana, not 14 September, not ₦1.08B, and not Lagos Foods.
        Somebody at another company would install a rule with an empty record and find out for themselves.
      </Callout>

      <Callout tone="teal" title="The rejected one was rejected for a reason worth publishing on its own">
        Weekend cadence watch cannot produce a measurable finding in any workspace, because push frequency is a
        global setting nearly everywhere. That is a constraint twenty-seven companies have hit, and it belongs in
        the community rather than in a marketplace listing — which is where it was sent, and where it is now the
        most-adopted constraint of the six.
      </Callout>
    </div>
  );
};

export default RequestedRoute;
