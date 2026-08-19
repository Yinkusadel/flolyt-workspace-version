import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { BLOCKAGE_ROWS, EXEC_KPIS } from "@/pages/everyday/digest/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D08 — Exec digest, reached at /digest?scope=org. */
export function ExecState() {
  usePageBreadcrumb([{ label: "Digest", to: "/digest" }, { label: "Where the org is stuck" }]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Where the org is stuck</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Wednesday 13 August · 118 teams · four of these need Ada and two do not</p>
        </div>
        <Button className="shrink-0">Grant a standing authority</Button>
      </div>

      <KpiCards items={EXEC_KPIS} />

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Where the org is stuck, not what happened
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
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
              {BLOCKAGE_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.where}</td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", TONE_TEXT_CLASS[row.behindTone])}>
                    {row.behind}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", TONE_TEXT_CLASS[row.stuckForTone])}>
                    {row.stuckFor}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.needs}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.needsAda ? "rose" : "neutral"}>{row.needsAda ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="An exec digest is a list of blockages, not a summary of activity">
        Ada owns nothing directly, so her personal digest is nearly empty — exactly backwards for the person with the
        widest span. This one answers a single question: what is stuck that only I can unstick. Two of the six are
        marked as not hers, so the list stays honest rather than flattering.
      </Callout>
    </div>
  );
}
