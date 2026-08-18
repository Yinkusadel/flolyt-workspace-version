import { cn } from "@/lib/utils";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { ActorAvatar } from "@/pages/rooms/actor";
import { AGENTS_WATCHING, LEVERS } from "@/pages/goals/new/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** G05 — New goal · what moves it. */
export function StepLevers() {
  return (
    <div className="space-y-5">
      <Callout tone="ultra" title="A goal you cannot connect to a lever is a number you watch, not a goal you own">
        Before this is saved, Flolyt shows what actually moves the metric and who controls each of those things.
        Most of them will not be you — that is normal and it is worth knowing on day one rather than in week nine.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What moves the 90-day repeat rate, in order of measured effect
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Lever</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Measured effect</th>
                <th className={HEAD_CLASS}>Stage</th>
                <th className={HEAD_CLASS}>Who controls it</th>
                <th className={HEAD_CLASS}>Yours?</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {LEVERS.map((row) => (
                <tr key={row.lever} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.lever}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", TONE_TEXT_CLASS[row.effectTone])}>{row.effect}</td>
                  <td className="px-4 py-3 text-ink-3">{row.stage}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {row.person ? (
                        <ActorAvatar actor={{ kind: "human", person: row.person }} size="sm" />
                      ) : (
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.deptColor }} />
                      )}
                      <span className="text-ink-2">{row.person ? row.person.name : row.dept}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.yours ? "teal" : "rose"}>{row.yours ? "yes" : "no"}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone}>{row.stateLabel}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="amber" title="One of six levers is yours">
        Ifeoma owns the goal and controls reactivation. Everything else that moves this number belongs to
        Engineering, Product, Support, Sales and Finance. This is not an argument against her owning it — somebody
        has to. It is an argument for the handoff chain, and for her seeing on day one exactly whose door she will
        be knocking on.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Agents assigned to watch it
        </p>
        <dl className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {AGENTS_WATCHING.map((row) => (
            <div
              key={row.role + row.value}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <dt className="shrink-0 text-[11px] text-ink-4">{row.role}</dt>
              <dd className={cn("text-[11.5px] sm:text-right", TONE_TEXT_CLASS[row.tone])}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
