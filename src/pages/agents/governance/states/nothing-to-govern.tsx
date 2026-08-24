import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GV01_EMPTY, GV01_ROWS } from "@/pages/agents/governance/data";

/** GV01 — before anything has been logged. Wired but unreachable with GOVERNANCE_STATE's current default. */
export function NothingToGovernState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Governance</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">0 log entries · nothing has happened yet</p>
      </div>

      <GovernanceTabs active="The log" />

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">{GV01_EMPTY.heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">{GV01_EMPTY.body}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link to="/governance/capability" className="text-[11.5px] font-semibold text-ultra hover:underline">
            See what will be logged
          </Link>
          <Link to="/settings/governance" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            Read the retention policy
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">{GV01_EMPTY.footnote}</p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What will be written here, and by whom</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Event</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Written by</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Contains</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Editable</th>
              </tr>
            </thead>
            <tbody>
              {GV01_ROWS.map((row) => (
                <tr key={row.event} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.event}</td>
                  <td className="px-4 py-3 text-ink-3">{row.writtenBy}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.contains}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="rose">no</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The fifth row is the one this whole section exists to make checkable">
        Everywhere else in Flolyt says no agent can send anything. That is a claim, and a claim about a piece of
        software is worth what its evidence is worth. Here, every send in the workspace's history carries a human
        identity and a re-authentication, and anybody can go and look.
      </Callout>
    </div>
  );
}
