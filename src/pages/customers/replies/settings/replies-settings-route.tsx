import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RepliesKvList } from "@/pages/customers/replies/kv-list";
import { RP13_KV_ROWS, RP13_RULE_ROWS } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RP13 — /settings/replies, outside the /replies tree, matching the /settings/experiments precedent. */
const RepliesSettingsRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Replies", to: "/replies" }, { label: "Settings" }]}
        title="Reply settings"
        subtitle="Ten rules · two are yours, five cannot be turned off, three can never be turned on"
        action={
          <div className="flex flex-wrap gap-2.5">
            <Button type="button" variant="outline" onClick={() => navigate("/replies/use")}>
              What a reply may be used for
            </Button>
            <Button type="button" onClick={() => toast.success("Settings saved")}>
              Save
            </Button>
          </div>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Rule</th>
              <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Currently</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {RP13_RULE_ROWS.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.currently}</td>
                <td className="px-4 py-3 text-ink-4">{row.whoSetIt}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChange ? "teal" : "rose"}>{row.canChange ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.stateTone === "neutral" ? "neutral" : "teal"}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The last rule is the one that keeps 168 unanswered messages visible">
        Letting unowned replies fall through to Support would empty this queue tomorrow and would be the single
        most humane-looking change available. It is refused because Support would absorb them silently, and the
        fact that two stages have nobody in them would stop being anybody's problem — which is exactly how it
        stayed true for 214 days.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where replies connect to the rest of the product</p>
        <RepliesKvList rows={RP13_KV_ROWS} />
      </section>
    </div>
  );
};

export default RepliesSettingsRoute;
