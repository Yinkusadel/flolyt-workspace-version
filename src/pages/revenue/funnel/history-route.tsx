import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { FN12_KV_ROWS, FN12_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN12 — /funnel/history. */
const FunnelHistoryRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Funnel</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every change to the funnel's definition · not to the numbers, to what they mean
        </p>
      </div>

      <FunnelTabs active="History" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>Every change to the funnel itself · not to the numbers, to the definition</p>
        <Button type="button" size="sm" variant="outline" onClick={() => toast.success("Log exported")}>
          Export the log
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Change</th>
              <th className={HEAD_CLASS}>Step</th>
              <th className={`${HEAD_CLASS} text-right`}>When</th>
              <th className={HEAD_CLASS}>Effect on the figures</th>
              <th className={HEAD_CLASS}>Who</th>
            </tr>
          </thead>
          <tbody>
            {FN12_ROWS.map((row, i) => (
              <tr key={`${row.change}-${i}`} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.change}</td>
                <td className="px-4 py-3 text-ink-2">{row.step}</td>
                <td className="px-4 py-3 text-right text-ink-4">{row.when}</td>
                <td className={`px-4 py-3 ${FN_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                    <PersonAvatar kind="human" initials={row.who.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.who.department] }} />
                    {row.who.name.split(" ")[0]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="A definition change is the most dangerous kind of movement and the hardest to see">
        On 11 July the value step was narrowed from "2 orders in 60 days" to "30 days", and 58.0% became 54.1% for
        every historical period at once. Nothing about the business changed. Anyone comparing a June slide with a
        July one would find a four-point fall that never happened, which is why definition changes sit in their own
        log rather than mixed into the numbers.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How the funnel protects comparisons</p>
        <FunnelKvList rows={FN12_KV_ROWS} />
      </section>
    </div>
  );
};

export default FunnelHistoryRoute;
