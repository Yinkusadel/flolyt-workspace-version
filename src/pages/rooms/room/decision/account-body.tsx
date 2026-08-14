import { cn } from "@/lib/utils";
import type { DecisionLogEntry, MemoryCard, RevenueCondition } from "@/pages/rooms/types";

const TONE_VALUE_CLASS: Record<RevenueCondition["tone"], string> = {
  teal: "text-teal",
  rose: "text-rose",
  muted: "text-ink-3",
};

/** Screen 31 (account persistent room) — see flolyt-kit-122/31-room-account-persistent.svg. */
export function AccountBody({
  posture,
  decisionsLogged,
  memory,
}: {
  posture: RevenueCondition[];
  decisionsLogged: DecisionLogEntry[];
  memory: MemoryCard[];
}) {
  return (
    <div className="space-y-8 overflow-y-auto p-6">
      <section>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Revenue posture · three conditions, kept separate
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {posture.map((condition) => (
            <div key={condition.key} className="rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                {condition.key}
              </p>
              <p className={cn("mt-2 text-[16px] font-semibold", TONE_VALUE_CLASS[condition.tone])}>
                {condition.value}
              </p>
              <p className="mt-1.5 text-[10.5px] leading-snug text-ink-3">{condition.detail}</p>
              <p className="mt-2.5 border-t border-dashed border-line pt-2.5 text-[10px] text-ink-4">
                Treatment: {condition.treatment}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Decisions logged</p>
        <div className="mt-4 space-y-5 border-l-[1.5px] border-line pl-5">
          {decisionsLogged.map((entry, i) => (
            <div key={i} className="relative">
              <span
                className={cn(
                  "absolute top-1 -left-[26px] size-2 rounded-full border-[1.5px]",
                  entry.measured ? "border-teal bg-teal" : "border-line bg-paper"
                )}
                aria-hidden
              />
              <p className="font-mono text-[9.5px] text-ink-4">
                {entry.time} · {entry.actor}
              </p>
              <p className="mt-1 text-[12px] font-medium text-ink">{entry.headline}</p>
              <p className="mt-1 text-[10.5px] text-ink-3">{entry.detail}</p>
              {entry.dissent && (
                <div className="mt-1.5 border-l-2 border-line pl-2.5">
                  <p className="text-[10.5px] text-ink-3">
                    Dissent — {entry.dissent.who}: "{entry.dissent.quote}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Business memory · what this account has taught us
        </p>
        <div className="mt-3 space-y-3">
          {memory.map((card, i) => (
            <div key={i} className="rounded-card border border-dashed border-ultra-border bg-ultra-bg p-4">
              <p className="text-[11.5px] leading-relaxed text-ink-2">{card.body}</p>
              <p className="mt-2 font-mono text-[9px] text-ultra">{card.meta}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
