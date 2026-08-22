import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MarketplaceTabs } from "@/pages/agents/marketplace/tabs";
import { MK06_CUSTOM_ROWS, MK06_ROWS, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK06 — /marketplace/publishers. */
const PublishersRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Publishers</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Three kinds of publisher · nothing lists unreviewed · one rejection shown</p>
        </div>
        <Button type="button" size="sm" onClick={() => toast.info("Listing requests go through Agent Builder")}>
          Request a listing
        </Button>
      </div>

      <MarketplaceTabs active="Publishers" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who publishes, and what each label actually means</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Publisher</th>
                <th className={`${HEAD_CLASS} text-right`}>Agents</th>
                <th className={HEAD_CLASS}>What the label means</th>
                <th className={`${HEAD_CLASS} text-right`}>Reviewed by</th>
                <th className={HEAD_CLASS}>What it does not mean</th>
              </tr>
            </thead>
            <tbody>
              {MK06_ROWS.map((row) => (
                <tr key={row.publisher} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.publisher}</td>
                  <td className={`px-4 py-3 text-right font-mono ${MK_TONE_CLASS[row.agentsTone]}`}>{row.agents}</td>
                  <td className="px-4 py-3 text-ink-3">{row.meaning}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.reviewedBy}</td>
                  <td className="px-4 py-3 text-amber">{row.notMean}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Verified means somebody read what it asks for and what it claims · it does not mean it is good">
        The review checks that the fields it requests match what it says it watches, that its claim ceiling matches
        what it can read, and that it inherits the nine limits. Nobody at Flolyt has run it on your customers, and
        the label is worded on every listing to say exactly that rather than implying a recommendation.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The four customer-published agents</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Published because</th>
                <th className={`${HEAD_CLASS} text-right`}>Requested by</th>
                <th className={`${HEAD_CLASS} text-right`}>Review took</th>
                <th className={`${HEAD_CLASS} text-right`}>Company named</th>
              </tr>
            </thead>
            <tbody>
              {MK06_CUSTOM_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.agent}</td>
                  <td className="px-4 py-3 text-ink-3">{row.publishedBecause}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.requestedBy}</td>
                  <td className={`px-4 py-3 text-right ${MK_TONE_CLASS[row.reviewTookTone]}`}>{row.reviewTook}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="teal">{row.companyNamed}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Publishing companies are never named, and that is the same rule the community runs on">
        A company that shares an agent is sharing a method, and naming them would make publishing a statement
        about their business. The third row was rejected because the agent could not produce a measurable finding
        in any workspace — which is a review outcome worth showing, since a marketplace that only lists what
        passed looks like everything passes.
      </Callout>
    </div>
  );
};

export default PublishersRoute;
