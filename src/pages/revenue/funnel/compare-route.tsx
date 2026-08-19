import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { BarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { FN05_RULED_OUT_ROWS, FN05_WEEK_BARS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN05 — /funnel/compare, "Where it bent". */
const FunnelCompareRoute = () => {
  return (
    <div className="space-y-8">
      <FunnelTabs active="Compare" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Week by week · checkout to first order, all four markets</p>
        <div className="space-y-3 rounded-card border border-line bg-paper p-4">
          {FN05_WEEK_BARS.map((row) => (
            <BarRow key={row.label} label={row.label} percent={row.percent} tone={row.tone} trailing={row.sub} trailingTone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title="It bent in one week and then stopped bending">
        The fall happened over two weeks and has been flat for twenty-one. That shape matters: a gradual decline
        would suggest a market or a competitor, and a step change with a floor suggests one thing that changed once.
        It is the single strongest piece of evidence behind the causal chip on Activate, and it is the reason the
        room was worth opening.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What else changed in that fortnight, and was ruled out</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Also happened</th>
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>Ruled out because</th>
                <th className={HEAD_CLASS}>By</th>
              </tr>
            </thead>
            <tbody>
              {FN05_RULED_OUT_ROWS.map((row) => (
                <tr key={row.happened} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.happened}</td>
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.because}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="agent" initials={row.agent.initials} size="sm" />
                      {row.agent.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Three rival explanations were tested and named, which is what makes the fourth a claim">
        A causal chip is not earned by finding a correlation. It is earned by writing down what else could have
        caused it and showing why each one does not fit. All four are kept on this screen permanently, including the
        one that was never ruled out, so anyone arguing with the finding starts from the same list rather than from
        scratch.
      </Callout>

      <div className="flex justify-end">
        <Button type="button" onClick={() => toast.success("Room opened")}>
          Open the room
        </Button>
      </div>
    </div>
  );
};

export default FunnelCompareRoute;
