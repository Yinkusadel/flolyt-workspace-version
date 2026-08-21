import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { CM08_CARDS, CM08_FEATURE_ROWS, CM08_NOTES, CM_CHIP_TONE, CM_TONE_CLASS } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const ACCENT_CLASS: Record<"muted" | "risk" | "ai", string> = {
  muted: "border-line",
  risk: "border-rose-border",
  ai: "border-ultra-border",
};

/** CM08 — /community/refused, "What this is not". Own header, no tab bar. */
const RefusedRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Community", to: "/community" }, { label: "What this is not" }]}
        title="What this is not"
        subtitle="Five things that would be easy to build · all refused · one of them asked for nine times"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CM08_CARDS.map((card) => (
          <div key={card.k} className={cn("rounded-card border-2 bg-paper p-4", ACCENT_CLASS[card.acc])}>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{card.k}</p>
            <h3 className="mt-1.5 text-[14px] font-semibold text-ink">{card.b}</h3>
            <p className="mt-2 text-[10.5px] leading-relaxed text-ink-3">{card.t}</p>
            <p className="mt-3 border-t border-dashed border-line pt-2.5 font-mono text-[9.5px] text-ink-4">{card.f}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Things that would be easy to build and are refused</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Feature</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked for</th>
                <th className={HEAD_CLASS}>Why it is refused</th>
                <th className={HEAD_CLASS}>Where the question is answered instead</th>
              </tr>
            </thead>
            <tbody>
              {CM08_FEATURE_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.feature}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.askedForTone]}>{row.askedFor}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={cn("px-4 py-3", CM_TONE_CLASS.ai)}>{row.whereAnswered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The fourth row is the one that would quietly break everything else">
        {CM08_NOTES.fourthRow}
      </Callout>

      <Callout tone="teal" title="The last refusal is the one that keeps the section alive">
        {CM08_NOTES.lastRefusal}
      </Callout>
    </div>
  );
};

export default RefusedRoute;
