import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/rooms/actor";
import { ORCHESTRATOR } from "@/pages/rooms/data";
import { TENSIONS, TENSION_COMPARISON } from "@/pages/goals/conflicts-data";

const TENSION_ACCENT: Record<string, string> = {
  rose: "border-rose-border",
  amber: "border-amber-border",
  neutral: "border-line",
};

/** G11 — Goals in tension. */
export function GoalsInTensionRoute() {
  const kpis: Kpi[] = [
    { eyebrow: "Goals set", value: "5 company", note: "62 team goals beneath them" },
    { eyebrow: "In tension", value: "3 pairs", tone: "amber", note: "one is expensive" },
    { eyebrow: "Cost of the worst pair", value: "₦88M", tone: "rose", note: "in CAC, this quarter" },
    { eyebrow: "Detected by", value: "Orchestrator", note: "not by a person" },
  ];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Goals", to: "/goals" }, { label: "In tension" }]}
        title="Goals in tension"
        subtitle="Three pairs pull against each other · one costs ₦88M and nobody has decided it"
        action={<Button onClick={() => toast.success("Sent to Ada")}>Send to Ada</Button>}
      />

      <KpiCards items={kpis} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Where two goals pull against each other
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {TENSIONS.map((tension) => (
            <div key={tension.title} className={cn("rounded-card border bg-paper p-4", TENSION_ACCENT[tension.tone])}>
              <div className="flex items-center gap-1.5">
                <ActorAvatar actor={{ kind: "agent", agent: ORCHESTRATOR }} size="sm" />
                <span className="font-mono text-[9.5px] font-semibold text-ink-4">{tension.severityLabel}</span>
              </div>
              <h3 className="mt-2.5 text-[13px] font-semibold text-ink">{tension.title}</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{tension.body}</p>
              <p
                className={cn(
                  "mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px]",
                  tension.tone === "rose" ? "text-rose" : tension.tone === "amber" ? "text-amber" : "text-ink-3"
                )}
              >
                {tension.footline}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The expensive one, in detail
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase"></th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                  Second orders
                </th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                  90-day repeat rate
                </th>
              </tr>
            </thead>
            <tbody>
              {TENSION_COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-4">{row.label}</td>
                  <td className={cn("px-4 py-3", row.winner === "left" ? "font-semibold text-amber" : "text-ink-2")}>
                    {row.left}
                  </td>
                  <td className={cn("px-4 py-3", row.winner === "right" ? "font-semibold text-teal" : "text-ink-2")}>
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="ultra" title="Flolyt does not pick, and it does not average">
        The Orchestrator names the tension, prices it where a price exists, and puts it in front of the two owners
        and the person above them. A product that quietly reconciled these into one composite score would be hiding
        the only decision that matters here — which is Ada's, and which nobody has asked her to make.
      </Callout>
    </div>
  );
}
