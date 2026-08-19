import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { SYSTEMS_CLOSING_CALLOUT, SYSTEMS_INFO_CARDS, SYSTEMS_ROWS } from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_TONE_CLASS = {
  ultra: "border-ultra-border bg-ultra-bg",
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
  neutral: "border-line bg-paper-2",
} as const;

/** I13 — Systems, /inbox/systems. */
const SystemsRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Inbox", to: "/inbox" }, { label: "Systems" }]}
        title="Systems"
        subtitle="Five items · nothing dropped · what each one blocks is the column that matters"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[960px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>What</th>
              <th className={HEAD_CLASS}>Since</th>
              <th className={HEAD_CLASS}>Effect</th>
              <th className={HEAD_CLASS}>Queued</th>
              <th className={HEAD_CLASS}>Owner</th>
              <th className={HEAD_CLASS}>State</th>
              <th className={HEAD_CLASS}>Blocks?</th>
            </tr>
          </thead>
          <tbody>
            {SYSTEMS_ROWS.map((row) => (
              <tr key={row.what} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.sinceTone ? TONE_TEXT_CLASS[row.sinceTone] : "text-ink-4")}>
                  {row.since}
                </td>
                <td className={cn("px-4 py-3", row.effectTone ? TONE_TEXT_CLASS[row.effectTone] : "text-ink-3")}>{row.effect}</td>
                <td className="px-4 py-3 text-ink-4 whitespace-nowrap">{row.queued ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.owner ? (
                    <span className="flex items-center gap-2 font-semibold text-ink-2">
                      <PersonDot person={row.owner} size="sm" />
                      {row.owner.name}
                    </span>
                  ) : (
                    <Chip tone={row.ownerTone}>{row.ownerLabel}</Chip>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.stateTone}>{row.state}</Chip>
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.blocksTone}>{row.blocks}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{SYSTEMS_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{SYSTEMS_CLOSING_CALLOUT.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The two that are not failures
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {SYSTEMS_INFO_CARDS.map((card) => (
            <div key={card.label} className={cn("flex flex-col justify-between rounded-card border p-4", CARD_TONE_CLASS[card.tone])}>
              <div>
                <span className={cn("font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[card.tone])}>
                  {card.label}
                </span>
                <h3 className="mt-2 text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
              </div>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] font-semibold", TONE_TEXT_CLASS[card.tone])}>
                {card.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemsRoute;
