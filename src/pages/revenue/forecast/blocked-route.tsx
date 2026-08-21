import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { ForecastTabs } from "@/pages/revenue/forecast/tabs";
import { FC06_KV_ROWS, FC06_ROWS, FC_CHIP_TONE, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FC06 (disk) — /forecast/blocked. */
const ForecastBlockedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five blocked · three on data, two on nobody having agreed to be wrong</p>
        </div>
        <Button type="button" variant="outline" onClick={() => toast.info("Opening the assign-an-owner workflow")}>
          Assign an owner
        </Button>
      </div>

      <ForecastTabs active="Blocked" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Five forecasts that cannot be produced, and the two different reasons</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Forecast</th>
                <th className={HEAD_CLASS}>Blocked by</th>
                <th className={`${HEAD_CLASS} text-right`}>Kind of blocker</th>
                <th className={`${HEAD_CLASS} text-right`}>Since</th>
                <th className={HEAD_CLASS}>Who could unblock it</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked</th>
              </tr>
            </thead>
            <tbody>
              {FC06_ROWS.map((row) => (
                <tr key={row.forecast} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.forecast}</td>
                  <td className="px-4 py-3 text-ink-2">{row.blockedBy}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${FC_TONE_CLASS[row.sinceTone]}`}>{row.since}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                  <td className={`px-4 py-3 text-right ${FC_TONE_CLASS[row.askedTone]}`}>{row.asked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Two of these are one click away and have been for seven months">
        Churn and Adopt are not blocked by data. They are blocked by nobody having agreed to be wrong about them,
        which Ada can fix in a minute and has not been asked to. Grouping them with the COGS gap would make all five
        look like an engineering backlog; separating them shows that the cheapest two fixes in this section are
        conversations rather than tickets.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is shown in place of a blocked forecast</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC06_KV_ROWS} />
        </div>
      </section>
    </div>
  );
};

export default ForecastBlockedRoute;
