import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AN10_CARDS, AN10_ROWS, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_ACCENT_CLASS: Record<string, string> = {
  ai: "border-ultra-border bg-ultra-bg",
  warn: "border-amber-border bg-amber-bg",
  muted: "border-line bg-paper-2",
};

/** AN10 — /agent-detail/conflicts, "Disagreements". */
const ConflictsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "Disagreements" }]}
        title="Disagreements"
        subtitle="One unresolved conflict, 160 days old · and the answer costs nothing"
        action={
          <Button type="button" onClick={() => toast.success("Kenya comparison queued")}>
            Run the Kenya comparison
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {AN10_CARDS.map((card) => (
          <div key={card.eyebrow} className={`flex flex-col rounded-card border p-4 ${CARD_ACCENT_CLASS[card.tone] ?? "border-line bg-paper"}`}>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.7px] text-ink-4 uppercase">{card.eyebrow}</p>
            <p className="mt-1.5 text-[14px] font-semibold text-ink">{card.heading}</p>
            <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
            <p className={`mt-2.5 border-t border-dashed border-line pt-2 font-mono text-[10px] font-semibold ${AN_TONE_CLASS[card.tone]}`}>
              {card.footer}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would settle it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What would settle it</th>
                <th className={`${HEAD_CLASS} text-right`}>How long</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost</th>
                <th className={`${HEAD_CLASS} text-right`}>Who could start it</th>
                <th className={`${HEAD_CLASS} text-right`}>Started</th>
              </tr>
            </thead>
            <tbody>
              {AN10_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.howTone]}`}>{row.how}</td>
                  <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                  <td className="px-4 py-3 text-right text-ink-3">{row.who}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.startedTone === "risk" ? "rose" : row.startedTone === "warn" ? "amber" : "neutral"}>{row.started}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The second row costs nothing, takes an afternoon, and nobody has done it in 160 days">
        Kenya received the release and its channel mix barely moved, which separates the two explanations almost
        perfectly. It is available today, needs no holdout and no approval, and has been sitting there since
        March. This screen exists so that the cheap answer stops being invisible next to the expensive one.
      </Callout>
    </div>
  );
};

export default ConflictsRoute;
