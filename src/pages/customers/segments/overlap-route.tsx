import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { SegmentsTabs } from "@/pages/customers/segments/tabs";
import { SG06_ROWS, SG06_STATS, SG_KPI_TONE, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG06 — /segments/overlap. */
const SegmentsOverlapRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Overlap</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">41,300 people in more than one segment · 6,400 silently suppressed this week</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening precedence-rule editor")}>
          Change a precedence rule
        </Button>
      </div>

      <SegmentsTabs active="Overlap" />

      <KpiCards items={SG06_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SG_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where segments in use are claiming the same people</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Overlap</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Segments</th>
                <th className={HEAD_CLASS}>What happens at send</th>
                <th className={HEAD_CLASS}>Who decided</th>
              </tr>
            </thead>
            <tbody>
              {SG06_ROWS.map((row) => (
                <tr key={row.overlap} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.overlap}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SG_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-2">{row.segments}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whatHappens}</td>
                  <td className="px-4 py-3 text-ink-4">{row.whoDecided}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Six thousand four hundred people were suppressed this week and nobody was told">
        The frequency cap works silently by design, which is right at send time and wrong afterwards — a campaign
        that reached 6,400 fewer people than its audience says will report a lower response rate for a reason
        nobody can see. The count is published here weekly, and it is the number to check before concluding a play
        underperformed.
      </Callout>

      <Callout tone="ultra" title="Payment beats marketing, and that is a rule a person wrote">
        When somebody is in both a dunning segment and a reactivation one, the dunning message goes and the
        reactivation one does not. Ada wrote that in February and it is applied 9,200 times. It is a standing rule
        with an author and a date, not a default, and it is on this screen so it can be argued with rather than
        discovered.
      </Callout>
    </div>
  );
};

export default SegmentsOverlapRoute;
