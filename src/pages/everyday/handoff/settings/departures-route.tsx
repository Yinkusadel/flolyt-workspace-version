import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { DEPARTURE } from "@/pages/everyday/handoff/data";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H13 — `/settings/departures`. Built for the one reference departure the export shows, Peter Kariuki. */
export default function DeparturesRoute() {
  const d = DEPARTURE;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: "Departures" }]}
        title={`${d.person.name} is leaving`}
        subtitle={`Last day ${d.lastDay} · ${d.itemCount} things · ${d.atRisk} behind them`}
        action={<Button onClick={() => toast.success("Handover confirmed")}>Confirm the handover</Button>}
      />

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <p className="text-[12.5px] font-semibold text-ink">
          {d.person.name}'s last day is {d.lastDay}. He holds {d.itemCount} things.
        </p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          {d.atRisk} sits behind them. Nothing reassigns itself, and access is revoked at 18:00 on the 22nd whether
          or not this is done.
        </p>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>What he holds</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Count</th>
              <th className={HEAD_CLASS}>Behind it</th>
              <th className={HEAD_CLASS}>If nothing is done</th>
              <th className={HEAD_CLASS}>Goes to</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.label}</td>
                <td className="px-4 py-3 text-right text-ink-2">{row.count}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.behindItTone ? TONE_TEXT_CLASS[row.behindItTone] : "font-mono text-[10.5px] text-ink-4")}>
                  {row.behindIt}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.ifNothingTone ? TONE_TEXT_CLASS[row.ifNothingTone] : "text-ink-3")}>
                  {row.ifNothing}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.goesTo ? (
                    <div className="flex items-center gap-1.5">
                      <PersonDot person={row.goesTo} size="sm" />
                      <span className="text-ink-2">{row.goesTo.name.split(" ")[0]}</span>
                    </div>
                  ) : (
                    <span className="text-ink-4">Nobody</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.stateTone}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-3 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          The line between what transfers and what does not
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {d.cards.map((card) => (
            <div key={card.eyebrow} className="rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">{card.eyebrow}</p>
              <h3 className="mt-1.5 text-[12.5px] font-semibold text-ink">{card.title}</h3>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{card.body}</p>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 text-[10.5px] font-semibold", TONE_TEXT_CLASS[card.footnoteTone])}>
                {card.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
