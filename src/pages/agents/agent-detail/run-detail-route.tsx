import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AN08_HERO, AN08_ROWS, AN_RUN_TITLES, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function TheCausalRun() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Repeat & Decay", to: "/agent-detail" }, { label: AN_RUN_TITLES["2aug"] }]}
        title={AN_RUN_TITLES["2aug"]}
        subtitle="Six turns, 5.1M rows, ₦24 · and the redirect at turn five is on the record"
        action={
          <Button asChild type="button">
            <Link to="/agent-detail/findings/1">See the finding</Link>
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AN08_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{AN08_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-2">{AN08_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AN08_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{AN08_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-teal">{AN08_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Turn by turn</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Turn</th>
                <th className={HEAD_CLASS}>What it did</th>
                <th className={`${HEAD_CLASS} text-right`}>Rows</th>
                <th className={`${HEAD_CLASS} text-right`}>Time</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
              </tr>
            </thead>
            <tbody>
              {AN08_ROWS.map((row) => (
                <tr key={row.turn} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink-4">{row.turn}</td>
                  <td className="px-4 py-3 text-ink-2">{row.did}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.rows}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.time}</td>
                  <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.resultTone]}`}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Turn five is Ravi correcting the agent mid-run and it is on the permanent record of this run">
        He told it to net off refunds before attributing anything. The figure moved from ₦412M to ₦386M and the
        split between causes did not change. Both halves are kept — that he was right about the number, and that
        it made no difference to the conclusion — because the next redirect is easier to judge with six of these
        on the record.
      </Callout>

      <Callout tone="rose" title="The whole thing cost ₦24 and the question had been open since 11 March">
        Nothing about this run was clever. It read a table nobody had connected, joined it to a curve everybody
        had already seen, and checked three alternatives. What made it possible was somebody connecting releases
        that morning, and what made it necessary was five months of nobody having done so.
      </Callout>
    </div>
  );
}

function RunNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Run not found</p>
      <Link to="/agent-detail/runs" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Runs
      </Link>
    </div>
  );
}

/** AN08 (`2aug`) — the section's only built run detail. */
const RunDetailRoute = () => {
  const { rid } = useParams();

  if (rid === "2aug") return <TheCausalRun />;
  return <RunNotFound />;
};

export default RunDetailRoute;
