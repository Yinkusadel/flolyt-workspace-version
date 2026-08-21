import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { QuoteCard } from "@/pages/knowledge/business-memory/quote-card";
import { BusinessMemoryKvList } from "@/pages/knowledge/business-memory/kv-list";
import { BM_TONE_CLASS, ME04_CITATION_ROWS, ME04_EVIDENCE_ROWS, ME04_NOTE, ME04_OVERTURN_ROWS, ME04_QUOTE } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function FirstOrderDiscountDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Business memory", to: "/business-memory" }, { label: "Discounting the first order" }]}
        title="One learning"
        subtitle="Validated, cited four times, and superseded in exactly one market"
        action={
          <Button type="button" onClick={() => toast.success("Copied a citation link")}>
            Cite it
          </Button>
        }
      />

      <QuoteCard text={ME04_QUOTE.text} source={ME04_QUOTE.source} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The evidence behind it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What was done</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={HEAD_CLASS}>Measured how</th>
                <th className={`${HEAD_CLASS} text-right`}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {ME04_EVIDENCE_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", BM_TONE_CLASS[row.resultTone])}>{row.result}</td>
                  <td className="px-4 py-3 text-ink-3">{row.measured}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.confidenceTone])}>{row.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where it has been cited, and what happened</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={HEAD_CLASS}>What it was used for</th>
                <th className={`${HEAD_CLASS} text-right`}>Outcome</th>
                <th className={`${HEAD_CLASS} text-right`}>Did it hold?</th>
              </tr>
            </thead>
            <tbody>
              {ME04_CITATION_ROWS.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.room}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-3">{row.usedFor}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.outcomeTone])}>{row.outcome}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.heldTone])}>{row.held}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="It was cited against the Ghana launch, overruled, and Ghana is the one market where it does not hold">
        {ME04_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would overturn this</p>
        <BusinessMemoryKvList rows={ME04_OVERTURN_ROWS} />
      </section>
    </div>
  );
}

function LearningNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Learning not found</p>
      <Link to="/business-memory" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to business memory
      </Link>
    </div>
  );
}

/** ME04 (`first-order-discount`) — the index's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const LearningDetailRoute = () => {
  const { id } = useParams();

  if (id === "first-order-discount") return <FirstOrderDiscountDetail />;
  return <LearningNotFound />;
};

export default LearningDetailRoute;
