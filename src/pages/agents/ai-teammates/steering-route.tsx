import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TM09_HISTORY, TM09_ROWS, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM09 — /ai-teammates/steering. */
const SteeringRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "AI teammates", to: "/ai-teammates" }, { label: "Working with one" }]}
        title="Working with one"
        subtitle="Five things you can do mid-run · four land at the next turn · one stops it everywhere"
        action={
          <Link to="/ai-teammates/runs" className="text-[11.5px] font-semibold text-ultra hover:underline">
            Open the run
          </Link>
        }
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What you can do to an agent that is in the middle of a run</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[700px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Action</th>
                <th className={HEAD_CLASS}>What it does</th>
                <th className={`${HEAD_CLASS} text-right`}>When it lands</th>
                <th className={`${HEAD_CLASS} text-right`}>Scope</th>
              </tr>
            </thead>
            <tbody>
              {TM09_ROWS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.action}</td>
                  <td className="px-4 py-3 text-ink-3">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.whenTone]}`}>{row.when}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Redirects land between turns and never inside one">
        An agent halfway through reading 4.2M rows finishes that read before taking your instruction. Interrupting
        mid-tool-call would produce a partial table that looks like a complete one, which is the one failure mode
        nobody would catch. The queued redirect is shown with the turn it will apply at, so waiting feels like a
        decision rather than a delay.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened when Ravi redirected this run</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[600px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {TM09_HISTORY.map((row) => (
                <tr key={`${row.when}-${row.effect}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The redirect changed the number and not the conclusion, and both facts are kept">
        Ravi was right about the refunds and it made no difference to what the agent was actually arguing. That is
        recorded on the run, which matters, because the next time somebody redirects Repeat & Decay the history
        says whether its conclusions tend to survive being corrected. Six redirects so far, four of which changed
        nothing.
      </Callout>
    </div>
  );
};

export default SteeringRoute;
