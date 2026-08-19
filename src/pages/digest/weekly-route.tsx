import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { WEEKLY_DELTA_ROWS, WEEKLY_KPIS, WEEKLY_NARRATIVE } from "@/pages/digest/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D06 — Weekly roll-up, /digest/weekly. */
const DigestWeeklyRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Weekly roll-up</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Monday 4 – Sunday 10 August · sent Monday 07:00 · about three minutes to read</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/settings/digest">Digest settings</Link>
        </Button>
      </div>

      <KpiCards items={WEEKLY_KPIS} />

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The week in one paragraph
        </p>
        <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
          <h3 className="text-[13px] font-semibold text-ink">Monday 4 August – Sunday 10 August</h3>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{WEEKLY_NARRATIVE}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What moved, and what did not
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Thing</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Start of week</th>
                <th className={cn(HEAD_CLASS, "text-right")}>End of week</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Change</th>
                <th className={HEAD_CLASS}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {WEEKLY_DELTA_ROWS.map((row) => (
                <tr key={row.thing} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.thing}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4 whitespace-nowrap">{row.start}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink whitespace-nowrap">{row.end}</td>
                  <td className={cn("px-4 py-3 text-right font-mono font-semibold whitespace-nowrap", TONE_TEXT_CLASS[row.changeTone])}>
                    {row.change}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">The weekly is not a longer daily</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          It answers one question the daily cannot: did the direction change. Four of the six rows above got worse
          over a week in which every individual day looked manageable — and none of those four would have triggered
          a threshold on any single morning.
        </p>
      </div>
    </div>
  );
};

export default DigestWeeklyRoute;
