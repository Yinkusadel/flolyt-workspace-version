import { cn } from "@/lib/utils";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { DONE_NOT_COUNTED, DONE_TODAY_ROWS } from "@/pages/everyday/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T14 — a log of items the user completed/decided today. */
const DoneRoute = () => {
  const stats: Kpi[] = [
    { eyebrow: "Cleared today", value: "4 items", note: "in 31 minutes" },
    { eyebrow: "Value moved", value: "₦531M", tone: "teal", note: "into rooms and plays" },
    { eyebrow: "Median time to decide", value: "7 min", tone: "teal", note: "was 2 days in January" },
    { eyebrow: "Still open", value: "0", tone: "teal", note: "your list is empty" },
  ];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "What to do today", to: "/what-to-do-today" }, { label: "Done" }]}
        title="Done today"
        subtitle="Four items in 31 minutes · ₦531M moved into rooms and plays · nothing recovered yet"
      />

      <KpiCards items={stats} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you did, and what it set in motion
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What you did</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Took</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Value</th>
                <th className={HEAD_CLASS}>What happened next</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              </tr>
            </thead>
            <tbody>
              {DONE_TODAY_ROWS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.action}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4 whitespace-nowrap">{row.at}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-teal whitespace-nowrap">{row.took}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.valueTone ? TONE_TEXT_CLASS[row.valueTone] : "text-ink")}>
                    {row.value}
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.whatNext}</td>
                  <td className={cn("px-4 py-3.5 text-right whitespace-nowrap font-mono text-[10.5px] font-semibold", TONE_TEXT_CLASS[row.badgeTone])}>
                    {row.badge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="Two of these took one minute each and released ₦119M of blocked work">
        Naming an owner and re-dating a commitment are not achievements. They are the kind of thing that sits for
        two weeks because nobody's screen puts them in front of a person with the cost attached. Half the value of
        this list is in items nobody would call work.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">What is not counted here</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {DONE_NOT_COUNTED.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-2">{row.label}</span>
              <span className={cn("font-mono text-[10px]", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-4")}>
                {row.note}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="ultra" title="This screen is deliberately not a productivity metric">
        There is no streak, no daily total to beat and no comparison with your team. Counting decisions rewards
        making them quickly, and the one thing this product should never optimise for is deciding faster than the
        evidence allows.
      </Callout>
    </div>
  );
};

export default DoneRoute;
