import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { GovernanceKvList } from "@/pages/agents/governance/kv-list";
import { GV15_KV, GV15_ROWS, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** GV15 — /governance/export. */
const ExportRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Governance", to: "/governance" }, { label: "Export" }]}
        title="Export for an auditor"
        subtitle="Seven things · four cannot be removed, two are not in the log to include"
        action={
          <Button type="button" onClick={() => toast.success("Export started")}>
            Export
          </Button>
        }
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What an auditor gets, and what they can check with it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Included</th>
                <th className={HEAD_CLASS}>What it lets them check</th>
                <th className={`${HEAD_CLASS} text-right`}>Optional?</th>
                <th className={`${HEAD_CLASS} text-right`}>Format</th>
              </tr>
            </thead>
            <tbody>
              {GV15_ROWS.map((row) => (
                <tr key={row.included} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.included}</td>
                  <td className="px-4 py-3 text-ink-3">{row.lets}</td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.optionalTone]}`}>{row.optional}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Four things cannot be excluded and two cannot be included">
        An export without the tool list would leave the central claim uncheckable, and an export without the
        sequence would let a removal go unnoticed. Message content and customer data are not in the log at all, so
        there is nothing to withhold — an auditor who wants to see what was sent goes to the campaign, where a
        person's name is on it.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who has exported this, and why</p>
        <GovernanceKvList rows={GV15_KV} />
      </section>

      <p className="text-[11px] text-ink-4">
        <Link to="/governance/limits" className="font-semibold text-ultra hover:underline">
          See what this cannot tell you
        </Link>
      </p>
    </div>
  );
};

export default ExportRoute;
