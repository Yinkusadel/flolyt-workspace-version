import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentDot } from "@/pages/everyday/rooms/actor";
import { BusinessMemoryTabs } from "@/pages/knowledge/business-memory/tabs";
import { BM_TONE_CLASS, ME14_NOTES, REVIEW_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME14 — /business-memory/review. */
const ReviewRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nine flagged because a condition moved</p>
      </div>

      <BusinessMemoryTabs active="Due for review" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Learnings whose conditions have changed since they were written</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Learning</th>
                <th className={HEAD_CLASS}>What changed</th>
                <th className={`${HEAD_CLASS} text-right`}>Written</th>
                <th className={HEAD_CLASS}>Flagged by</th>
                <th className={HEAD_CLASS}>What review means</th>
              </tr>
            </thead>
            <tbody>
              {REVIEW_ROWS.map((row) => (
                <tr key={row.learning} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.learning}</td>
                  <td className="px-4 py-3 text-ink-3">{row.changed}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.written}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <AgentDot agent={row.flaggedBy} size="sm" />
                      {row.flaggedBy.name}
                    </span>
                  </td>
                  <td className={cn("px-4 py-3", BM_TONE_CLASS[row.meansTone])}>{row.means}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Nothing here expires on a date, because a learning does not become false by getting old">
        {ME14_NOTES.noExpiry}
      </Callout>

      <Callout tone="teal" title="The last row was flagged by the condition Ravi wrote when he decided not to act">
        {ME14_NOTES.ukRow}
      </Callout>
    </div>
  );
};

export default ReviewRoute;
