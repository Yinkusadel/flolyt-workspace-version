import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ScopeTabs } from "@/pages/everyday/what-to-do-today/scope-tabs";
import { ORG_STUCK } from "@/pages/everyday/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T11 — org-wide "where is the org stuck" exec view, reached via ?scope=org. */
export function OrgScopeState() {
  const stats: Kpi[] = [
    { eyebrow: "Teams behind pace", value: "14 of 118", tone: "amber", note: "up from 11 last week" },
    { eyebrow: "Revenue at risk, open", value: "₦1.31B", tone: "rose", note: "across four markets" },
    { eyebrow: "Waiting on you", value: "6", tone: "rose", note: "₦1.4B behind them" },
    { eyebrow: "Unowned across the org", value: "19 rooms", tone: "rose", note: "₦96M" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Where the org is stuck</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">118 teams · four of these need Ada and two do not</p>
        </div>
        <Button className="shrink-0">Grant a standing authority</Button>
      </div>

      <ScopeTabs active="org" />

      <KpiCards items={stats} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is stuck, rather than what is happening
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What is stuck</th>
                <th className={HEAD_CLASS}>Where</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Behind it</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Stuck for</th>
                <th className={HEAD_CLASS}>Needs</th>
                <th className={cn(HEAD_CLASS, "text-right")}>You?</th>
              </tr>
            </thead>
            <tbody>
              {ORG_STUCK.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3.5 text-ink-3 whitespace-nowrap">{row.where}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.behindTone ? TONE_TEXT_CLASS[row.behindTone] : "text-ink")}>
                    {row.behind}
                  </td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.stuckForTone ? TONE_TEXT_CLASS[row.stuckForTone] : "text-ink-4")}>
                    {row.stuckFor}
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.needs}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Chip tone={row.needsYou ? "rose" : "neutral"}>{row.needsYou ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="An exec list is a list of blockages, not a summary of activity">
        Ada owns nothing directly, so her personal list is nearly empty — which is exactly backwards for the person
        with the widest span. This scope answers one question: what is stuck that only I can unstick. Two of the
        six above are explicitly marked as not hers, so the list stays honest rather than flattering.
      </Callout>

      <Callout tone="rose" title="The cheapest item here has been available since 12 January">
        Assigning owners to Advocate and Churn takes two names and no budget. Between them those stages have 36
        agent findings, zero rooms, and nine breached thresholds routing to an empty field.
      </Callout>
    </div>
  );
}
