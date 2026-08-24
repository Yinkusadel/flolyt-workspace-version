import { useState } from "react";
import { Link } from "react-router-dom";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { SchemaTabs } from "@/pages/data/schema/tabs";
import { SchemaKvList } from "@/pages/data/schema/kv-list";
import { ConfirmARenameModal } from "@/pages/data/schema/modals/confirm-a-rename-modal";
import { SM06_CHANGE_ROWS, SM06_WHAT_HAPPENS_KV, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM06 — /schema/changes. */
const ChangesRoute = () => {
  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five schema changes · four caught the same day, one took six months</p>
      </div>

      <SchemaTabs active="Changes" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every change to a mapped field or event since December</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What changed</th>
                <th className={HEAD_CLASS}>Kind</th>
                <th className={HEAD_CLASS}>Detected</th>
                <th className={HEAD_CLASS}>Effect</th>
                <th className={HEAD_CLASS}>Handled by</th>
              </tr>
            </thead>
            <tbody>
              {SM06_CHANGE_ROWS.map((row) => (
                <tr key={`${row.when}-${row.what}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink-2">
                    {row.rowAction === "rename" ? (
                      <button type="button" onClick={() => setRenameOpen(true)} className="text-left text-ultra hover:underline">
                        {row.what}
                      </button>
                    ) : (
                      row.what
                    )}
                  </td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.kindTone]}`}>{row.kind}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.detectedTone]}`}>{row.detected}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className="px-4 py-3 text-ink-4">{row.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Four of five changes were detected the same day and the fifth took six months">
        Renames, new values and removed values are all visible in a delivery's schema. A change in what a field{" "}
        <em>means</em> upstream is invisible by construction — the column is the same, the type is the same, the
        volume is the same. It was found by a person who knew how an invoice was structured, six months after it
        started.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens when a mapped field changes</p>
        <SchemaKvList rows={SM06_WHAT_HAPPENS_KV} />
      </section>

      <p className="text-[11px] text-ink-3">
        See{" "}
        <Link to="/schema/change-costs" className="font-semibold text-ultra hover:underline">
          what each kind of change costs
        </Link>
        , and the one kind no check can see.
      </p>

      <ConfirmARenameModal open={renameOpen} onOpenChange={setRenameOpen} />
    </div>
  );
};

export default ChangesRoute;
