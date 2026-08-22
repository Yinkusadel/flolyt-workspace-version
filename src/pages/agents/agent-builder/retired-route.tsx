import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentBuilderTabs } from "@/pages/agents/agent-builder/tabs";
import { RetireModal } from "@/pages/agents/agent-builder/modals/retire-modal";
import { AB14_RETIRED_ROWS, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** Retired tab — no dedicated frame in the export; grounded in AB14's own base table (Weekend Watch, Reseller Terms). */
const RetiredRoute = () => {
  const [retireOpen, setRetireOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Retired</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Two retired · kept, readable, and neither was a mistake to build</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setRetireOpen(true)}>
          See how a retirement is explained
        </Button>
      </div>

      <AgentBuilderTabs active="Retired" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Retired here · kept and readable, never deleted</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Built by</th>
                <th className={`${HEAD_CLASS} text-right`}>Retired</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings kept</th>
              </tr>
            </thead>
            <tbody>
              {AB14_RETIRED_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.agent}</td>
                  <td className="px-4 py-3 text-ink-3">{row.builder}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.retired}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AB_TONE_CLASS[row.findingsKeptTone]}`}>{row.findingsKept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Retiring is not deleting, and that distinction is the point">
        Both agents stop reading from the day they retire, but their findings, their definitions and the reasons
        they were retired all stay readable. A deleted agent makes an old finding unexplainable — a retired one
        doesn't.
      </Callout>

      <RetireModal open={retireOpen} onOpenChange={setRetireOpen} />
    </div>
  );
};

export default RetiredRoute;
