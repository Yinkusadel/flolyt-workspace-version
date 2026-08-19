import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RANKING_INPUTS, RANKING_WORKED_EXAMPLE } from "@/pages/everyday/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T04 — a dedicated disclosure page, reached from every "How this is ranked" button. */
const RankingRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "What to do today", to: "/what-to-do-today" }, { label: "How this is ranked" }]}
        title="How this is ranked"
        subtitle="Revenue at stake × confidence ÷ effort, doubled if it blocks a goal · age is shown, never scored"
        action={<Button>Adjust effort estimates</Button>}
      />

      <Callout tone="ultra" title="The order is an opinion and it is stated as one">
        There is no objectively correct order for four items in three teams worth ₦619M combined. Flolyt takes a
        position, shows the arithmetic, and lets you disagree with any part of it. A ranked list that will not
        explain itself is just a list somebody sorted.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The formula</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Input</th>
                <th className={HEAD_CLASS}>What it is</th>
                <th className={HEAD_CLASS}>Where it comes from</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Can you change it?</th>
              </tr>
            </thead>
            <tbody>
              {RANKING_INPUTS.map((row) => (
                <tr key={row.input} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.input}</td>
                  <td className="px-4 py-3.5 text-ink-2">{row.whatItIs}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5",
                      row.whereFrom === "estimated · editable" ? "text-amber" : "text-ink-4"
                    )}
                  >
                    {row.whereFrom}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Chip tone={row.canChangeTone}>{row.canChange}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Today's four, with the arithmetic shown
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Confidence</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Effort</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Goal</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Score</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Rank</th>
              </tr>
            </thead>
            <tbody>
              {RANKING_WORKED_EXAMPLE.map((row) => (
                <tr key={row.item} className={cn("border-b border-line last:border-0", row.rank === "below" && "opacity-60")}>
                  <td className="px-4 py-3.5 text-ink-2">{row.item}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink">{row.atStake}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.confidence}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.effort}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.goal}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-semibold text-ink">{row.score}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="amber" title="Why age is shown and never scored">
        An item that has waited three weeks is not more important for having waited — it is more embarrassing.
        Scoring age would push cheap old items above expensive new ones and turn the list into a queue-clearing
        exercise. Where waiting genuinely costs money, that cost is already inside "revenue at stake", as it is
        for item one at ₦2.1M a day.
      </Callout>
    </div>
  );
};

export default RankingRoute;
