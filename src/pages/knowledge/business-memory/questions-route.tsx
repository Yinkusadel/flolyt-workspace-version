import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { BusinessMemoryTabs } from "@/pages/knowledge/business-memory/tabs";
import { BM_TONE_CLASS, ME10_NOTES, OPEN_QUESTION_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME10 — /business-memory/questions. */
const QuestionsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five things the workspace knows it does not know</p>
      </div>

      <BusinessMemoryTabs active="Open questions" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Things this workspace knows it does not know</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Question</th>
                <th className={HEAD_CLASS}>Why it is open</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked</th>
                <th className={`${HEAD_CLASS} text-right`}>Blocked by</th>
                <th className={HEAD_CLASS}>Who could answer it</th>
                <th className={`${HEAD_CLASS} text-right`}>Worth</th>
              </tr>
            </thead>
            <tbody>
              {OPEN_QUESTION_ROWS.map((row) => (
                <tr key={row.question} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.question}</td>
                  <td className={cn("px-4 py-3", BM_TONE_CLASS[row.whyTone])}>{row.why}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", BM_TONE_CLASS[row.askedTone])}>{row.asked}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.blockedByTone])}>{row.blockedBy}</td>
                  <td className="px-4 py-3 text-ink-3">{row.who}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", BM_TONE_CLASS[row.worthTone])}>{row.worth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="An open question is not a task and this is not a backlog">
        {ME10_NOTES.notABacklog}
      </Callout>

      <Callout tone="rose" title="The first question is the one nobody has ever asked">
        {ME10_NOTES.neverAsked}
      </Callout>
    </div>
  );
};

export default QuestionsRoute;
