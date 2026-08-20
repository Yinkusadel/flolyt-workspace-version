import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import type { PersonRef } from "@/pages/everyday/rooms/types";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { ScenarioTabs } from "@/pages/revenue/scenario/tabs";
import { SC_HISTORY_KV, SC_HISTORY_ROWS, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * History — no dedicated frame in the export (SC01-SC15 cover every other
 * TABS entry), so this reuses the timeline vocabulary already established by
 * SC08's per-scenario "what has happened to it" table, widened to every
 * saved scenario, same "sibling route sharing the tab bar" shape as
 * /scenario/actuals and /scenario/blocked.
 */
const ScenarioHistoryRoute = () => {
  return (
    <div className="space-y-8">
      <ScenarioTabs active="History" />

      <p className={EYEBROW_CLASS}>Every assumption edit and save, across every scenario · not just S-114's own timeline</p>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>When</th>
              <th className={HEAD_CLASS}>Scenario</th>
              <th className={HEAD_CLASS}>What</th>
              <th className={HEAD_CLASS}>Who</th>
              <th className={HEAD_CLASS}>Effect</th>
            </tr>
          </thead>
          <tbody>
            {SC_HISTORY_ROWS.map((row, i) => (
              <tr key={`${row.when}-${i}`} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink-4">{row.when}</td>
                <td className="px-4 py-3 font-semibold text-ink">{row.scenario}</td>
                <td className="px-4 py-3 text-ink-2">{row.what}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                    {row.whoKind === "human" ? (
                      <PersonAvatar
                        kind="human"
                        initials={row.who.initials}
                        size="sm"
                        style={{ backgroundColor: DEPARTMENT_COLORS[(row.who as PersonRef).department] }}
                      />
                    ) : (
                      <PersonAvatar kind="agent" initials={row.who.initials} size="sm" />
                    )}
                    {row.who.name.split(" ")[0]}
                  </span>
                </td>
                <td className={`px-4 py-3 ${SC_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="A definition change is the most dangerous kind of movement and the hardest to see">
        Zainab's change to S-114's recovery window moved the low end by ₦47M for anyone reading the scenario after
        her, with no separate announcement — the only record of it is this log and the timeline on the scenario
        itself. Nothing here is silently applied; every row names who moved a figure and what it did to the range.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this log protects</p>
        <ScenarioKvList rows={SC_HISTORY_KV} />
      </section>
    </div>
  );
};

export default ScenarioHistoryRoute;
