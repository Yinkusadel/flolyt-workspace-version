import { Link } from "react-router-dom";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { IdentityTabs } from "@/pages/data/identity/tabs";
import { ID12_DEPENDENCY_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID12 — /identity/dependencies, the "Rules" tab's content. */
const DependenciesRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Seven things resolve through the rule · two move in opposite directions</p>
      </div>

      <IdentityTabs active="Rules" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything that resolves through the identity rule</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>Which total it uses</th>
                <th className={HEAD_CLASS}>Affected by a rule change</th>
                <th className={HEAD_CLASS}>Affected by unjoinable records</th>
              </tr>
            </thead>
            <tbody>
              {ID12_DEPENDENCY_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.totalUsed}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.ruleChangeTone]}`}>{row.ruleChange}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.unjoinableTone]}`}>{row.unjoinable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Two figures move in opposite directions when unjoinable records exist">
        Acquisition counts them, so volume is overstated. Retention cannot join them to a second transaction, so
        repeat rate is understated. The same 42,000 people make the top of the funnel look better and the middle
        look worse, and nothing about either figure is wrong given what can be joined.
      </Callout>

      <Callout tone="teal" title="The ledger is the only thing on this list that does not move">
        A closed room's recovered figure was credited against a population as it was understood on the day, and it
        stays that way — the same principle as a restated baseline keeping both versions. Otherwise an identity
        rule change in year two would silently rewrite year one's recovered value.
      </Callout>

      <p className="text-[11px] text-ink-3">
        See{" "}
        <Link to="/identity/rule" className="font-semibold text-ultra hover:underline">
          the rule itself
        </Link>
        .
      </p>
    </div>
  );
};

export default DependenciesRoute;
