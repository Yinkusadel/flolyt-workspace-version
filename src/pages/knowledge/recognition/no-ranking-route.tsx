import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RC04_CARDS, RC04_NOTES, RC04_RANKING_ROWS, RC_CHIP_TONE } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const ACCENT_CLASS: Record<"muted" | "risk" | "ai", string> = {
  muted: "border-line",
  risk: "border-rose-border",
  ai: "border-ultra-border",
};

/** RC04 — /recognition/no-ranking, "Why there is no leaderboard". Own header, no tab bar. */
const NoRankingRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Recognition", to: "/recognition" }, { label: "Why there is no leaderboard" }]}
        title="Why there is no leaderboard"
        subtitle="Six possible rankings · five of them teach the wrong lesson · the sixth is this screen"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {RC04_CARDS.map((card) => (
          <div key={card.k} className={cn("rounded-card border-2 bg-paper p-4", ACCENT_CLASS[card.acc])}>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{card.k}</p>
            <h3 className="mt-1.5 text-[14px] font-semibold text-ink">{card.b}</h3>
            <p className="mt-2 text-[10.5px] leading-relaxed text-ink-3">{card.t}</p>
            <p className="mt-3 border-t border-dashed border-line pt-2.5 font-mono text-[9.5px] text-ink-4">{card.f}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What each ranking would quietly teach</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>If this were ranked by</th>
                <th className={HEAD_CLASS}>The person who wins</th>
                <th className={HEAD_CLASS}>What everybody learns</th>
                <th className={`${HEAD_CLASS} text-right`}>Offered</th>
              </tr>
            </thead>
            <tbody>
              {RC04_RANKING_ROWS.map((row) => (
                <tr key={row.rankedBy} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.rankedBy}</td>
                  <td className="px-4 py-3 text-ink-3">{row.winner}</td>
                  <td className="px-4 py-3 text-ink-3">{row.lesson}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.offeredTone]}>{row.offered}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The fifth row is the trap this section would fall into on its own">
        {RC04_NOTES.fifthRow}
      </Callout>

      <Callout tone="amber" title="Three people have asked for a leaderboard and all three had a reasonable question behind it">
        {RC04_NOTES.threeAsked}
      </Callout>
    </div>
  );
};

export default NoRankingRoute;
