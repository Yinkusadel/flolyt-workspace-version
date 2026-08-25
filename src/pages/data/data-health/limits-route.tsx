import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ReportAProblemModal } from "@/pages/data/data-health/modals/report-a-problem-modal";
import { DH14_LIMIT_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH14 — /data-health/limits, "What this cannot catch". */
const LimitsRoute = () => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data health", to: "/data-health" }, { label: "Limits" }]}
        title="Limits"
        subtitle="Seven problems · four caught automatically, and the two most expensive ones never are"
        action={
          <Button type="button" onClick={() => setReportOpen(true)}>
            Report a problem
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Problem</th>
              <th className={HEAD_CLASS}>Caught?</th>
              <th className={HEAD_CLASS}>Why</th>
              <th className={HEAD_CLASS}>What would catch it</th>
            </tr>
          </thead>
          <tbody>
            {DH14_LIMIT_ROWS.map((row) => (
              <tr key={row.problem} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.problem}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.caughtTone === "ok" ? "teal" : row.caughtTone === "warn" ? "amber" : "rose"}>{row.caught}</Chip>
                </td>
                <td className="px-4 py-3 text-ink-2">{row.why}</td>
                <td className={`px-4 py-3 ${DH_TONE_CLASS[row.wouldCatchTone]}`}>{row.wouldCatch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="The two things this section cannot catch are the two that have cost the most">
        Ad spend arrived perfectly for six months while excluding a fifth of itself. Support tickets about a
        delivery fee were classified correctly as delivery complaints for five months. Neither is a data health
        problem by any definition this screen can check, and both were found by a person who knew something the
        pipeline could not.
      </Callout>

      <Callout tone="ultra" title="The bottom row is the one people misfile here">
        A field that is correct and understood differently by two teams is not a data problem at all — it is a
        definition problem, and it belongs in business memory where Ravi's note about the word discount has been
        cited six times. Sending it here produces an investigation that finds nothing wrong and ends with everybody
        more confident.
      </Callout>

      <ReportAProblemModal open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
};

export default LimitsRoute;
