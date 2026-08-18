import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { BEFORE_STANDUP, FILTER_URL_RULES, SAVED_VIEWS_TODAY } from "@/pages/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T12 — filters + saved views applied, reached via any of ?effort=, ?owner=, ?filter=, ?view=. */
export function FiltersState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Filtered to "before standup" · three items, six minutes, all under two minutes each
          </p>
        </div>
        <Button className="shrink-0">Save this view</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[200px] flex-1 items-center rounded-control border-2 border-line bg-paper px-3.5 py-2">
          <span className="text-[11.5px] text-ink-4">Search your list</span>
        </div>
        <Chip tone="ultra" className="cursor-default">
          Quick wins
        </Chip>
        <Chip tone="neutral" className="cursor-default">
          Above ₦25M
        </Chip>
        <Chip tone="neutral" className="cursor-default">
          Overdue
        </Chip>
        <Chip tone="ultra" className="cursor-default">
          No owner
        </Chip>
        <Chip tone="neutral" className="cursor-default">
          + Filter
        </Chip>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Saved views</p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SAVED_VIEWS_TODAY.map((view) => (
            <button
              key={view.label}
              type="button"
              className={cn(
                "rounded-card border p-3.5 text-left",
                view.active ? "border-2 border-ultra-border bg-paper" : "border-line bg-paper"
              )}
            >
              <p className="text-[11.5px] font-semibold text-ink">{view.label}</p>
              <p className="mt-1 font-mono text-[10px] text-ink-4">{view.note}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Before standup · three items, six minutes total
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>#</th>
                <th className={HEAD_CLASS}>Do this</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Effort</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Time</th>
                <th className={HEAD_CLASS}>What it unblocks</th>
              </tr>
            </thead>
            <tbody>
              {BEFORE_STANDUP.map((row) => (
                <tr key={row.rank} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-mono text-ink-4">{row.rank}</td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.title}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.effort}/5</td>
                  <td className="px-4 py-3.5 text-right font-mono text-teal">{row.time}</td>
                  <td className="px-4 py-3.5 text-ink-3">{row.unblocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title='"Quick wins" is a filter on effort, not a lower standard'>
        Every item here still had to earn its place on revenue at stake and confidence. The filter removes the
        ones that need an hour, not the ones that need thought — and it exists because a list you cannot start is
        a list you stop opening.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Every filter is in the URL</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {FILTER_URL_RULES.map((rule) => (
            <div
              key={rule.label}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <span className="text-[11px] text-ink-2">{rule.label}</span>
              <span className={cn("font-mono text-[10px]", rule.tone ? TONE_TEXT_CLASS[rule.tone] : "text-ink-4")}>
                {rule.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
