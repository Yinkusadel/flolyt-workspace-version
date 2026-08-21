import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ExperimentsTabs } from "@/pages/customers/experiments/tabs";
import { EX_HISTORY_ROWS, EX_TONE_CLASS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * History — no dedicated frame in the export (`TABS` lists it as a fifth
 * tab but `xp.py` never calls `S.save("XP..", ..., "History", ...)`, same
 * "tab with no frame" gap Scenario and Campaigns each hit with their own
 * History tabs). Built anyway, grounded in the workspace's own recurring
 * vocabulary — "signed", "locked", "condition changed", "contamination
 * detected" — that every other Experiments screen already uses to describe
 * a registered, timestamped action.
 */
const ExperimentsHistoryRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">History</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Every signing, closure, condition change and contamination, in one log</p>
      </div>

      <ExperimentsTabs active="History" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The experiment log</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>Action</th>
                <th className={HEAD_CLASS}>Experiment</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {EX_HISTORY_ROWS.map((row) => (
                <tr key={`${row.when}-${row.action}-${row.experiment}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4 whitespace-nowrap">{row.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.action}</td>
                  <td className="px-4 py-3 text-ink-3">{row.experiment}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                  <td className={`px-4 py-3 ${EX_TONE_CLASS[row.detailTone]}`}>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="neutral" title="Every registered decision is logged, with who, when and what it was before">
        Signatures, closures, condition changes and contamination all land here with a name and a timestamp, never
        a role. A design that could be edited without a trace would produce a result shaped by whoever was
        watching — the log is what makes "nothing changed after it was signed" a checkable claim rather than an
        assurance.
      </Callout>
    </div>
  );
};

export default ExperimentsHistoryRoute;
