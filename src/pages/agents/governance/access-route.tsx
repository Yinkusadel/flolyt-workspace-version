import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GV06_ROWS, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV06 — /governance/access. */
const AccessRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data access</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Twelve agents · one personal field between them · no write access anywhere</p>
      </div>

      <GovernanceTabs active="Data access" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every agent, every source, every field · the whole surface on one screen</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={`${HEAD_CLASS} text-right`}>Sources</th>
                <th className={`${HEAD_CLASS} text-right`}>Fields</th>
                <th className={HEAD_CLASS}>Personal fields</th>
                <th className={`${HEAD_CLASS} text-right`}>Write access</th>
                <th className={`${HEAD_CLASS} text-right`}>Last reviewed</th>
              </tr>
            </thead>
            <tbody>
              {GV06_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">
                    <span className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-paper-3 font-mono text-[9px] font-semibold text-ink-3">
                        {row.initials}
                      </span>
                      {row.id ? (
                        <Link to={`/governance/access/${row.id}`} className="text-ultra hover:underline">
                          {row.agent}
                        </Link>
                      ) : (
                        row.agent
                      )}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${GV_TONE_CLASS[row.sourcesTone]}`}>{row.sources}</td>
                  <td className={`px-4 py-3 text-right font-mono ${GV_TONE_CLASS[row.fieldsTone]}`}>{row.fields}</td>
                  <td className={`px-4 py-3 ${GV_TONE_CLASS[row.personalTone]}`}>{row.personal}</td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.writeTone]}`}>{row.write}</td>
                  <td className={`px-4 py-3 text-right font-mono ${GV_TONE_CLASS[row.reviewedTone]}`}>{row.reviewed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="One agent reads a personal field and it is the only one that has to">
        Support Signal reads the body of a ticket, because a contact driver cannot be worked out from metadata.
        Nothing else in the workspace touches a name, an address, an email or a card token. The column exists so
        that the one exception is visible rather than buried in a per-agent settings screen nobody opens.
      </Callout>

      <Callout tone="ultra" title="Data Integrity reads twelve sources and zero fields, which looks like an error and is not">
        It reads metadata — row counts, freshness, schema — and never a value. Twelve sources with no field access
        is exactly what a source monitor should look like, and it is the row that makes the shape of this table
        legible: sources are what an agent can see, fields are what it can read inside them.
      </Callout>
    </div>
  );
};

export default AccessRoute;
