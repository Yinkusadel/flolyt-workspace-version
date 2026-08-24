import { Link } from "react-router-dom";

import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ID14_LIMIT_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID14 — /identity/limits, "What this cannot fix". */
const LimitsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Identity", to: "/identity" }, { label: "Limits" }]}
        title="Limits"
        subtitle="Six problems · one the rule solves, five it cannot, and one nobody can see"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Problem</th>
              <th className={HEAD_CLASS}>Can the rule fix it?</th>
              <th className={HEAD_CLASS}>Why</th>
              <th className={HEAD_CLASS}>What would</th>
            </tr>
          </thead>
          <tbody>
            {ID14_LIMIT_ROWS.map((row) => (
              <tr key={row.problem} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.problem}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canFix ? "teal" : "rose"}>{row.canFix ? "yes" : "no"}</Chip>
                </td>
                <td className="px-4 py-3 text-ink-2">{row.why}</td>
                <td className={`px-4 py-3 ${ID_TONE_CLASS[row.wouldFixTone]}`}>{row.wouldFix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="One of these six is a rule problem and the rest are not">
        Identity resolution is often treated as a matching algorithm to be tuned. Five of these six rows cannot be
        improved by any match key — they need a column, an event, or a decision that merging would be wrong. Tuning
        the rule harder would make the third row worse, not better.
      </Callout>

      <Callout tone="amber" title="Two people sharing an email address is the failure nobody can see">
        They merge, their orders combine, their consent resolves to the stricter state, and every figure is
        internally consistent. Nothing in the product will ever surface it, and the only signal is the one that
        surfaced the false merge in June — somebody writing in to say a message was not about them.
      </Callout>

      <p className="text-[11px] text-ink-3">
        See the{" "}
        <Link to="/identity/unjoinable" className="font-semibold text-ultra hover:underline">
          unjoinable records
        </Link>{" "}
        this affects, and{" "}
        <Link to="/identity/incidents/1" className="font-semibold text-ultra hover:underline">
          the false merge
        </Link>{" "}
        that surfaced the invisible one.
      </p>
    </div>
  );
};

export default LimitsRoute;
