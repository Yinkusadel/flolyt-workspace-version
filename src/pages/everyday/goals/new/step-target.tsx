import { cn } from "@/lib/utils";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { OWNER, OWNER_META, TARGET } from "@/pages/everyday/goals/new/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** G04 — New goal · target and owner. */
export function StepTarget() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The target</p>
        <div className="mt-2 flex flex-col gap-4 rounded-card border-2 border-ultra-border bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[24px] font-semibold text-ink">{TARGET.value}</p>
            <p className="mt-0.5 text-[10.5px] text-ink-3">
              by {TARGET.date} · {TARGET.pointsGained}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11.5px] text-ink-2">{TARGET.customers}</p>
            <p className="mt-0.5 text-[11.5px] text-ink-2">{TARGET.revenue}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What that target implies, before you commit to it
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}></th>
                <th className={HEAD_CLASS}>Figure</th>
                <th className={HEAD_CLASS}>Reading</th>
              </tr>
            </thead>
            <tbody>
              {TARGET.rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.label}</td>
                  <td className={cn("px-4 py-3 font-mono", row.figureTone ? TONE_TEXT_CLASS[row.figureTone] : "text-ink")}>
                    {row.figure}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.reading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="ultra" title="Flolyt will let you set it and will say what it thinks">
        A target three times better than the best quarter on record is not refused — it is your call and there may
        be reasons the data cannot see. What it will not do is stay quiet and then report you as behind pace in six
        weeks without ever having mentioned it.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Owner · one person, and it cannot be a team
        </p>
        <div className="mt-2 flex items-center gap-3 rounded-card border-2 border-ultra-border bg-ultra-bg p-4">
          <ActorAvatar actor={{ kind: "human", person: OWNER }} />
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-ink">{OWNER.name}</p>
            <p className="mt-0.5 text-[10.5px] text-ink-3">{OWNER_META.roleLine}</p>
          </div>
          <Chip tone="amber" className="shrink-0">
            {OWNER_META.loadLabel}
          </Chip>
        </div>

        <dl className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt className="shrink-0 text-[11px] text-ink-4">Reviewed</dt>
            <dd className="text-[11.5px] text-ink-2 sm:text-right">{OWNER_META.reviewed}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt className="shrink-0 text-[11px] text-ink-4">Escalates to</dt>
            <dd className="text-[11.5px] font-medium text-amber sm:text-right">{OWNER_META.escalatesTo}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt className="shrink-0 text-[11px] text-ink-4">Lead agent</dt>
            <dd className="text-[11.5px] font-medium text-ultra sm:text-right">{OWNER_META.leadAgent.name} · the agent that owns this reading</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt className="shrink-0 text-[11px] text-ink-4">Visible to</dt>
            <dd className="text-[11.5px] text-ink-2 sm:text-right">{OWNER_META.visibleTo}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
