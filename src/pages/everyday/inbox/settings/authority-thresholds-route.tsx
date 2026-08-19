import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { AuthorityTabs } from "@/pages/everyday/inbox/settings/authority-tabs";
import { AUTHORITY_CLOSING_CALLOUT, AUTHORITY_STATS, THRESHOLD_ROWS } from "@/pages/everyday/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** I11 — Approval authority (thresholds), /settings/authority. */
const AuthorityThresholdsRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Approval authority</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Who can approve what · seven rules · two people are the bottleneck for ₦1.4B
          </p>
        </div>
        <Button className="shrink-0" onClick={() => toast.success("Rule creation isn't wired up in this preview")}>
          New rule
        </Button>
      </div>

      <AuthorityTabs active="thresholds" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[920px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>A play that would</th>
              <th className={HEAD_CLASS}>Reach</th>
              <th className={HEAD_CLASS}>Cost or risk</th>
              <th className={HEAD_CLASS}>Approved by</th>
              <th className={HEAD_CLASS}>If they are away</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Median wait</th>
            </tr>
          </thead>
          <tbody>
            {THRESHOLD_ROWS.map((row, i) => (
              <tr key={`${row.play}-${i}`} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.play}</td>
                <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.reach}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.costTone ? TONE_TEXT_CLASS[row.costTone] : "text-ink-4")}>
                  {row.cost ?? "—"}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.approvedByTone ? TONE_TEXT_CLASS[row.approvedByTone] : "text-ink-2")}>
                  {row.approvedBy}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.ifAwayTone ? TONE_TEXT_CLASS[row.ifAwayTone] : "text-ink-3")}>
                  {row.ifAway}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.medianWaitTone ? TONE_TEXT_CLASS[row.medianWaitTone] : "text-ink-4")}>
                  {row.medianWait}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Where the queue is actually forming
        </p>
        <KpiCards items={AUTHORITY_STATS} />
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{AUTHORITY_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{AUTHORITY_CLOSING_CALLOUT.body}</p>
      </div>
    </div>
  );
};

export default AuthorityThresholdsRoute;
