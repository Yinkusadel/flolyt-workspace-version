import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { useChainContext } from "@/pages/handoff/chain/chain-layout";
import { OwnerCell } from "@/pages/handoff/owner-cell";
import { TeamDot } from "@/pages/inbox/team-dot";
import { TONE_TEXT_CLASS, TONE_BG_CLASS } from "@/pages/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H14 — a closed chain's own home (currently only "card-retry"). Own header, no tab bar — mirrors Rooms' ClosedRoom template. */
export default function ClosedChainRoute() {
  const { chain } = useChainContext();
  const obligations = chain.closedObligations ?? [];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: chain.title }]}
        title={chain.title}
        subtitle={chain.subtitle}
      />

      {chain.closedSummary && (
        <div className={cn("rounded-card border p-4", TONE_BG_CLASS[chain.closedSummary.tone])}>
          <p className="text-[12.5px] font-semibold text-ink">{chain.closedSummary.title}</p>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{chain.closedSummary.body}</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Owes</th>
              <th className={HEAD_CLASS}>Team</th>
              <th className={HEAD_CLASS}>Owner</th>
              <th className={HEAD_CLASS}>Accepted</th>
              <th className={HEAD_CLASS}>Due</th>
              <th className={HEAD_CLASS}>Done</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Days</th>
            </tr>
          </thead>
          <tbody>
            {obligations.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.title}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <TeamDot team={row.team} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <OwnerCell owner={row.owner} />
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.acceptedTone ? TONE_TEXT_CLASS[row.acceptedTone] : "text-ink-2")}>
                  {row.accepted}
                </td>
                <td className="px-4 py-3 text-ink-4 whitespace-nowrap">{row.due}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.doneTone ? TONE_TEXT_CLASS[row.doneTone] : "text-ink-2")}>
                  {row.done}
                </td>
                <td className={cn("px-4 py-3 text-right font-semibold", row.daysTone ? TONE_TEXT_CLASS[row.daysTone] : "text-ink-2")}>
                  {row.days}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-3 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Why this one worked and the delivery-fee chain did not
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {(chain.closedInsights ?? []).map((card) => (
            <div key={card.eyebrow} className="rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">{card.eyebrow}</p>
              <h3 className="mt-1.5 text-[12.5px] font-semibold text-ink">{card.title}</h3>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{card.body}</p>
              <p
                className={cn(
                  "mt-3 border-t border-dashed border-line pt-3 text-[10.5px] font-semibold",
                  card.footnoteTone ? TONE_TEXT_CLASS[card.footnoteTone] : "text-ink-3"
                )}
              >
                {card.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {chain.closedFooter && (
        <div className={cn("rounded-card border p-4", TONE_BG_CLASS[chain.closedFooter.tone])}>
          <p className="text-[12.5px] font-semibold text-ink">{chain.closedFooter.title}</p>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{chain.closedFooter.body}</p>
        </div>
      )}
    </div>
  );
}
