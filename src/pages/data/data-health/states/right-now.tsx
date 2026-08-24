import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { DataHealthTabs } from "@/pages/data/data-health/tabs";
import { DH03_SOURCE_ROWS, DH03_STATS, DH_CHIP_TONE, DH_KPI_TONE, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH03 — the default populated "Right now" state, and the /data-health tab bar's home tab. */
export function RightNowState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Eight healthy, one degraded six hours, one silent a year, one stopped in January
          </p>
        </div>
        <Button type="button" onClick={() => navigate("/data-health/incidents/checkout")}>
          Open the incident
        </Button>
      </div>

      <DataHealthTabs active="Right now" />

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12px] font-semibold text-ink">
          checkout_events has not delivered since 04:12 · six hours and forty-one minutes
        </p>
        <p className="mt-1.5 text-[10.5px] text-ink-2">
          Two funnel steps read Unavailable, one agent is paused, and nothing has been carried forward from
          yesterday.
        </p>
      </div>

      <KpiCards items={DH03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: DH_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every source, right now</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Last delivery</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Expected</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Rows</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Against trailing</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {DH03_SOURCE_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", DH_TONE_CLASS[row.lastDeliveryTone])}>{row.lastDelivery}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.expected}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", DH_TONE_CLASS[row.rowsTone])}>{row.rows}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", DH_TONE_CLASS[row.trailingTone])}>{row.trailing}</td>
                  <td className="px-4 py-3">
                    <Chip tone={DH_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {DH03_SOURCE_ROWS.map((row) => (
            <div key={row.source} className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[12.5px] font-semibold text-ink">{row.source}</span>
                <span className={cn("font-mono text-[11px] font-semibold", DH_TONE_CLASS[row.lastDeliveryTone])}>{row.lastDelivery}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.rows} rows · expected {row.expected}</p>
              <div className="mt-1.5">
                <Chip tone={DH_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="ultra" title="Tickets are up 31% and the row says healthy, because arrival is not the same as normality">
        A third more support contacts than usual arrived this morning, which is almost certainly the checkout
        outage. The source is delivering perfectly and the business is not, and this screen deliberately marks that
        as healthy-and-busy rather than as an incident — the volume check is about whether the pipe works, and the{" "}
        <Link to="/data-health/shape" className="font-semibold text-ultra hover:underline">
          shape check
        </Link>
        , which is a different row, is what would call this out.
      </Callout>

      <Callout tone="amber" title="Three of the four bad states mean completely different things and are worded differently">
        Degraded means it used to deliver and stopped six hours ago. Silent means it has been connected for a year
        and has never carried anything. Not delivering means it stopped in January and this is now the normal
        state. One word for all three would be tidier and would flatten a six-hour incident and a seven-month gap
        into the same colour.
      </Callout>
    </div>
  );
}
