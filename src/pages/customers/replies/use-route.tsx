import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RepliesKvList } from "@/pages/customers/replies/kv-list";
import { RP12_KV_ROWS, RP12_ROWS, RP_CHIP_TONE } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RP12 — /replies/use, a standalone policy page reached from Settings and the empty state's secondary CTA. */
const RepliesUseRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Replies", to: "/replies" }, { label: "What a reply may be used for" }]}
        title="What a reply may be used for"
        subtitle="Eight uses · three refused · writing to a company must not make somebody a target"
        action={
          <Button type="button" onClick={() => toast.info("This is the policy")}>
            Read the policy
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Use</th>
              <th className={`${HEAD_CLASS} text-right`}>Allowed?</th>
              <th className={HEAD_CLASS}>Why</th>
              <th className={`${HEAD_CLASS} text-right`}>Where it appears</th>
            </tr>
          </thead>
          <tbody>
            {RP12_ROWS.map((row) => (
              <tr key={row.use} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.use}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={RP_CHIP_TONE[row.allowedTone]}>{row.allowed}</Chip>
                </td>
                <td className="px-4 py-3 text-ink-3">{row.why}</td>
                <td className="px-4 py-3 text-right text-ink-4">{row.whereItAppears}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="Writing to a company must not make somebody a target">
        The two refusals in the middle are the ones a growth team would ask for first: people who complain are
        engaged, reachable and easy to segment. Allowing it would mean that the act of telling this company
        something is wrong quietly places you in an audience, and the next person who notices that stops writing
        in.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is stripped, and when</p>
        <RepliesKvList rows={RP12_KV_ROWS} />
      </section>
    </div>
  );
};

export default RepliesUseRoute;
