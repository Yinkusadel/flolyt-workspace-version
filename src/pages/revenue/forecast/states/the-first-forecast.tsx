import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { KUNLE } from "@/pages/everyday/rooms/data";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { FC02_KV_ROWS, FC02_STATS, FC_KPI_TONE } from "@/pages/revenue/forecast/data";

/** FC02 — the first person to sign a number. Wired but unreachable with FORECAST_STATE's current default. */
export function TheFirstForecastState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Forecast</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">One stage of eight · 88.4% signed by Kunle · the model said 87.9% and both are kept</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials={KUNLE.initials} style={{ backgroundColor: DEPARTMENT_COLORS[KUNLE.department] }} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">Kunle is the first person to put his name on a number</p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              Renewal at 88.4% over the next ninety days, from 89.1% today. He has written down that a fall below
              86% would mean he was wrong about the East African card fixes.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ultra">
              The model offered 87.9%. He overrode it upward and typed why, and both figures are kept.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={FC02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: s.tone ? FC_KPI_TONE[s.tone] : "ink" }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What committing to a number does here</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC02_KV_ROWS} />
        </div>
      </section>

      <Callout tone="ultra" title="The first forecast in the workspace disagrees with the model and that is the healthy version">
        If every forecast matched the projection there would be no reason for a person to be involved. Kunle thinks
        the card fixes land better than the trend implies; he may be wrong, and in ninety days the two numbers on
        this screen will say which. That is only possible because the model's figure was kept rather than replaced.
      </Callout>

      <Button type="button" variant="outline" onClick={() => toast.info("Scroll down · the table above is what committing to a number does here")}>
        See the others
      </Button>
    </div>
  );
}
