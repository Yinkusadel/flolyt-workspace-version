import { useState } from "react";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { DataHealthTabs } from "@/pages/data/data-health/tabs";
import { FreshnessBar } from "@/pages/data/data-health/freshness-bar";
import { ChangeAThresholdModal } from "@/pages/data/data-health/modals/change-a-threshold-modal";
import { DH04_FRESHNESS_BARS, DH04_THRESHOLD_ROWS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH04 — /data-health/freshness. */
const FreshnessRoute = () => {
  const [thresholdOpen, setThresholdOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Twenty-four hours per source · two late deliveries that lost nothing, and one seven-month gap
        </p>
      </div>

      <DataHealthTabs active="Freshness" />

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>The last twenty-four hours · one block an hour</p>
        <div className="space-y-4 rounded-card border border-line bg-paper p-4">
          {DH04_FRESHNESS_BARS.map((row) => (
            <FreshnessBar key={row.source} source={row.source} sub={row.sub} blocks={row.blocks} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title="The two amber blocks on tickets are late deliveries and nothing was lost">
        A two-hour source arriving at two hours forty is late, not broken, and the rows all turned up. They are
        shown because a source that is quietly drifting later every week is the earliest sign of something under
        strain, and it looks identical to healthy on any screen that only shows the current state.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What being late means, source by source</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Expected</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Late at</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Degraded at</th>
                <th className={HEAD_CLASS}>What changes at each point</th>
              </tr>
            </thead>
            <tbody>
              {DH04_THRESHOLD_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.expected}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber">{row.lateAt}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose">
                    {row.rowAction === "threshold" ? (
                      <button type="button" onClick={() => setThresholdOpen(true)} className="underline decoration-dotted underline-offset-2 hover:text-rose">
                        {row.degradedAt}
                      </button>
                    ) : (
                      row.degradedAt
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.whatChanges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Every source has its own patience and none of them is a global setting">
        A payments feed that is an hour late is an emergency and a tickets feed that is an hour late is fine. The
        thresholds are per source, set against what depends on them, and the last column is the reason each one is
        where it is — which is a more useful thing to argue about than a number in a settings screen.
      </Callout>

      <ChangeAThresholdModal open={thresholdOpen} onOpenChange={setThresholdOpen} />
    </div>
  );
};

export default FreshnessRoute;
