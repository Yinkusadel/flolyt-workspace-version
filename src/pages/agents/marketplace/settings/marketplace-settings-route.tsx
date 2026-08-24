import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { MarketplaceKvList } from "@/pages/agents/marketplace/kv-list";
import { MK13_ELSEWHERE_KV, MK13_ROWS, MK_CHIP_TONE, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK13 — /settings/marketplace, outside the /marketplace tree, matching the /settings/ai-teammates precedent. */
const MarketplaceSettingsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Marketplace", to: "/marketplace" }, { label: "Settings" }]}
        title="Marketplace settings"
        subtitle="Ten rules · one is yours, five cannot be turned off, four can never be turned on"
        action={
          <Button type="button" onClick={() => toast.success("Settings saved")}>
            Save
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[780px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Rule</th>
              <th className={`${HEAD_CLASS} text-right`}>Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {MK13_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className={`px-4 py-3 text-right font-mono ${MK_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.who}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={MK_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Publishers never learn who installed their agent, which makes the count the only feedback loop">
        A publisher sees a number go up and down and nothing else — no company names, no findings, no usage
        detail. It is a thin channel and it is the same wall the community runs on. The one thing that does travel
        is a missing precondition, sent deliberately, which is the most useful feedback anybody can give.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How the marketplace sits against the rest of the workspace</p>
        <MarketplaceKvList rows={MK13_ELSEWHERE_KV} />
      </section>
    </div>
  );
};

export default MarketplaceSettingsRoute;
