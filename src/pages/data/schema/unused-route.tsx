import { useState } from "react";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { SchemaTabs } from "@/pages/data/schema/tabs";
import { UnmapAFieldModal } from "@/pages/data/schema/modals/unmap-a-field-modal";
import { SM09_UNUSED_ROWS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM09 — /schema/unused. */
const UnusedRoute = () => {
  const [unmapOpen, setUnmapOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Four mapped fields nothing depends on · one of them should stay</p>
      </div>

      <SchemaTabs active="Unused" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Mapped and reading, and nothing depends on it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_RIGHT_CLASS}>Mapped</th>
                <th className={HEAD_CLASS}>Why it was mapped</th>
                <th className={HEAD_RIGHT_CLASS}>Depends on it</th>
                <th className={HEAD_CLASS}>Read by</th>
                <th className={HEAD_CLASS}>Action</th>
              </tr>
            </thead>
            <tbody>
              {SM09_UNUSED_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.field}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.mapped}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.dependentsTone]}`}>{row.dependents}</td>
                  <td className="px-4 py-3 text-ink-4">{row.readBy}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.actionTone]}`}>
                    {row.rowAction === "unmap" ? (
                      <button type="button" onClick={() => setUnmapOpen(true)} className="underline decoration-dotted underline-offset-2 hover:text-ultra">
                        {row.action}
                      </button>
                    ) : (
                      row.action
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Three fields are being read for reasons that no longer exist">
        Two were taken because they were there at connection and one was for a room that closed in March. None is
        harmful and all three widen the audit surface, appear in every access review, and make the agent access
        table longer than the thing it describes. Unmapping is the tidy-up nobody does until a review forces it.
      </Callout>

      <Callout tone="ultra" title="The second row is unused on purpose and should stay">
        `customers.referral_source` was mapped for a stage that has never had an owner. Nothing depends on it
        because nothing about that stage exists. Unmapping it would be correct by every rule on this screen and
        would remove the only piece of referral data the workspace holds, on the day somebody finally owns the
        stage.
      </Callout>

      <UnmapAFieldModal open={unmapOpen} onOpenChange={setUnmapOpen} />
    </div>
  );
};

export default UnusedRoute;
