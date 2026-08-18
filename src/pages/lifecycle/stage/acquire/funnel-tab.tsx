import { PersonAvatar } from "@/components/person-avatar";
import { BarTrack } from "@/pages/lifecycle/stage/bar";
import { ACQUIRE_FUNNEL_ACTION_CARDS, ACQUIRE_FUNNEL_STEPS } from "@/pages/lifecycle/stage/acquire/data";

const DELTA_TONE_CLASS = { rose: "text-rose", amber: "text-amber", teal: "text-teal" } as const;

/** A03 — Acquire's unique Funnel tab (visit to first order). */
const AcquireFunnelTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Visit to first order · last 90 days
        </p>
        <div className="space-y-4">
          {ACQUIRE_FUNNEL_STEPS.map((step) => (
            <div key={step.id} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[12.5px] font-semibold text-ink">{step.label}</span>
                <span className="font-mono text-[12px] font-semibold text-ink">{step.value}</span>
              </div>
              <BarTrack percent={step.percent} tone={step.tone} />
              {(step.delta || step.note) && (
                <div className="flex flex-wrap items-baseline justify-end gap-x-2 text-right">
                  {step.delta && (
                    <span className={`font-mono text-[11px] font-semibold ${DELTA_TONE_CLASS[step.deltaTone!]}`}>
                      {step.delta}
                    </span>
                  )}
                  {step.note && <span className="text-[9.5px] text-ink-4">{step.note}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The two drops worth acting on
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ACQUIRE_FUNNEL_ACTION_CARDS.map((card) => (
            <div key={card.id} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <div className="flex items-center gap-2">
                  {card.agentTag && <PersonAvatar kind="agent" initials={card.agentTag} size="sm" />}
                  <p className="font-mono text-[9px] font-medium text-ink-4">{card.meta}</p>
                </div>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p
                  className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${
                    card.footnoteTone === "rose" ? "text-rose" : "text-ink-2"
                  }`}
                >
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AcquireFunnelTab;
