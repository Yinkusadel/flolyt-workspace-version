import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CommunityTabs } from "@/pages/knowledge/community/tabs";
import { CM06_NOTES, CM_CHIP_TONE, CM_TONE_CLASS, QUESTION_ROWS } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM06 — /community/questions. */
const QuestionsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Community</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Five questions · the most answered one is about engineering queues, not revenue
        </p>
      </div>

      <CommunityTabs active="Questions" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Asked by companies, answered by companies · nothing here is from Flolyt</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Question</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked by</th>
                <th className={`${HEAD_CLASS} text-right`}>Answers</th>
                <th className={`${HEAD_CLASS} text-right`}>Age</th>
                <th className={`${HEAD_CLASS} text-right`}>Yours?</th>
                <th className={`${HEAD_CLASS} text-right`}>Useful</th>
              </tr>
            </thead>
            <tbody>
              {QUESTION_ROWS.map((row) => (
                <tr key={row.question} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.question}</td>
                  <td className={cn("px-4 py-3 text-right", CM_TONE_CLASS[row.askedByTone])}>{row.askedBy}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.answersTone])}>{row.answers}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.age}</td>
                  <td className="px-4 py-3 text-right">
                    {row.yours ? <Chip tone={CM_CHIP_TONE[row.yoursTone]}>{row.yours}</Chip> : null}
                  </td>
                  <td className={cn("px-4 py-3 text-right", CM_TONE_CLASS[row.usefulTone])}>{row.useful}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The most answered question in the community is not about revenue at all">
        {CM06_NOTES.mostAnswered}
      </Callout>

      <Callout tone="teal" title="Your question about contaminated holdouts is three days old and has six answers">
        {CM06_NOTES.yourQuestion}
      </Callout>
    </div>
  );
};

export default QuestionsRoute;
