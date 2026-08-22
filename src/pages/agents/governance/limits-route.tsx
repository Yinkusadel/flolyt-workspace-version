import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { GV16_ROWS, GV_CHIP_TONE, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV16 — /governance/limits. */
const LimitsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Governance", to: "/governance" }, { label: "Limits of this section" }]}
        title="What this cannot tell you"
        subtitle="Seven questions · three the log answers, three it cannot, one it deliberately does not"
        action={
          <Button asChild type="button" variant="outline">
            <Link to="/ai-teammates/record">See an agent's record</Link>
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Question</th>
              <th className={`${HEAD_CLASS} text-right`}>Can the log answer it?</th>
              <th className={HEAD_CLASS}>Why</th>
              <th className={`${HEAD_CLASS} text-right`}>What can</th>
            </tr>
          </thead>
          <tbody>
            {GV16_ROWS.map((row) => (
              <tr key={row.question} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.question}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={GV_CHIP_TONE[row.canTone]}>{row.can}</Chip>
                </td>
                <td className="px-4 py-3 text-ink-3">{row.why}</td>
                <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.whatTone]}`}>{row.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="The log proves boundaries and says nothing at all about value">
        It can show that no agent has ever acted, that Support Signal reads one personal field, and that Repeat &
        Decay read 312M rows last month. It cannot show that any of it was worth doing. Those are different
        questions and this section only answers the first kind, which is worth saying on a screen that could
        otherwise be mistaken for a scorecard.
      </Callout>

      <Callout tone="amber" title="Nobody logs whether a finding was read, and that gap is deliberate">
        Recording who opened what would answer a real question and would turn attention into a metric — and the
        moment reading is measured, thirty-six unread findings become somebody's performance problem rather than
        an argument for giving Adopt an owner. The unread count is visible; who did not read is not recorded.
      </Callout>
    </div>
  );
};

export default LimitsRoute;
