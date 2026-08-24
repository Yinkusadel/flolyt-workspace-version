import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesHero } from "@/pages/data/data-sources/hero-banner";
import { ChangeTheRuleModal } from "@/pages/data/identity/modals/change-the-rule-modal";
import { ID04_CLAUSE_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID04 — /identity/rule, "The rule". */
const RuleRoute = () => {
  const [changeOpen, setChangeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Identity", to: "/identity" }, { label: "The rule" }]}
        title="The identity rule"
        subtitle="Six clauses · five are choices, one is a missing column"
        action={
          <Button type="button" onClick={() => setChangeOpen(true)}>
            Change the rule
          </Button>
        }
      />

      <DataSourcesHero
        tone="teal"
        kicker="identity rule · version 1"
        value="unchanged"
        desc="Set 12 December. Every count in the product carries this version number."
        statLabel="if it changed"
        statValue="every count"
        statSub="restates, with a preview first"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The rule, clause by clause</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Clause</th>
                <th className={HEAD_CLASS}>What it says</th>
                <th className={HEAD_CLASS}>Effect</th>
                <th className={HEAD_CLASS}>Changeable</th>
              </tr>
            </thead>
            <tbody>
              {ID04_CLAUSE_ROWS.map((row) => (
                <tr key={row.clause} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.clause}</td>
                  <td className="px-4 py-3 text-ink-2">{row.says}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className={`px-4 py-3 ${ID_TONE_CLASS[row.changeableTone]}`}>{row.changeable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Changing the match key restates every historical figure in the product">
        Adding phone number as a match key would merge a further estimated 84,000 records and change every count,
        rate and cohort ever computed. It is offered, it requires a preview naming what moves, and both versions
        are kept — the same contract as a stage definition change, for the same reason.
      </Callout>

      <Callout tone="amber" title="The third clause is the only one that cannot be changed by choosing differently">
        No-account transactions cannot be joined however the rule is written, because there is nothing to join on.
        That is a schema gap requiring one field on the orders table, and it is the single highest-value column in
        this workspace.
      </Callout>

      <ChangeTheRuleModal open={changeOpen} onOpenChange={setChangeOpen} />
    </div>
  );
};

export default RuleRoute;
