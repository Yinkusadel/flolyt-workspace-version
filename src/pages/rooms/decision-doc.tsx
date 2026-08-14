import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AgentDot, PersonDot } from "@/pages/rooms/actor";
import { EvidenceBadge } from "@/pages/rooms/evidence-badge";
import type { DecisionDocData } from "@/pages/rooms/types";

const OWNER_STATUS_CLASS: Record<DecisionDocData["ownerStatus"], string> = {
  draft: "border-line bg-paper-2 text-ink-3",
  undecided: "border-amber-border bg-amber-bg text-amber",
  decided: "border-teal-border bg-teal-bg text-teal",
};

/** Tailwind needs literal class names — a template-built `sm:grid-cols-${n}` won't be picked up by the scanner. */
const IMPACT_COLS_CLASS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/** Screens 27/28 decision doc — see flolyt-kit-122/27-room-cohort-war-room.svg. */
export function DecisionDoc({ doc, className }: { doc: DecisionDocData; className?: string }) {
  return (
    <div className={cn("space-y-7 overflow-y-auto p-6", className)}>
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{doc.eyebrow}</p>
        <p className="mt-3 font-serif text-[22px] leading-snug text-ink">{doc.statement}</p>
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11.5px]">
          <AgentDot agent={doc.draftedBy} size="sm" />
          <span className="text-ink-4">drafted by</span>
          <span className="font-semibold text-ink-2">{doc.draftedBy.name}</span>
          <Badge variant="outline" className="border-line text-ink-3">
            draft
          </Badge>
          <PersonDot person={doc.owner} size="sm" />
          <span className="font-semibold text-ink-2">{doc.owner.name}</span>
          {doc.ownerNote && <span className="text-ink-4">{doc.ownerNote}</span>}
          <Badge variant="outline" className={cn("ml-auto border", OWNER_STATUS_CLASS[doc.ownerStatus])}>
            {doc.ownerStatus}
          </Badge>
        </div>
      </div>

      <section>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Why now</p>
        <div className="mt-3 space-y-3">
          {doc.whyNow.map((row) => (
            <div key={row.claim} className="grid gap-1 sm:grid-cols-[152px_1fr] sm:gap-4">
              <EvidenceBadge grade={row.grade} className="h-fit" />
              <div>
                <p className="text-[12.5px] text-ink-2">{row.claim}</p>
                <p className="mt-0.5 text-[11.5px] text-ink-3">{row.detail}</p>
                <p className="mt-1 font-mono text-[9.5px] text-ink-4">{row.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Impact</p>
        <div
          className={cn(
            "mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line",
            IMPACT_COLS_CLASS[Math.min(doc.impact.length, 4)]
          )}
        >
          {doc.impact.map((stat) => (
            <div key={stat.label} className="bg-paper p-3.5">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">{stat.label}</p>
              <p className={cn("mt-2 text-[17px] font-semibold", stat.tone === "rose" ? "text-rose" : "text-ink")}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10.5px] text-ink-4">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Recommended next step
        </p>
        <div className="mt-3 rounded-card border border-ultra-border bg-ultra-bg p-4">
          <p className="text-[12.5px] leading-relaxed text-ink">{doc.nextStep.body}</p>
          {doc.nextStep.footnote && <p className="mt-2 text-[11px] text-ink-3">{doc.nextStep.footnote}</p>}
        </div>
      </section>

      {doc.whatWouldChange && (
        <section>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What would change this
          </p>
          <p className="mt-3 text-[12.5px] text-ink-2">{doc.whatWouldChange}</p>
        </section>
      )}

      {doc.guardrails && (
        <section>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Guardrails</p>
          <div className="mt-3 overflow-hidden rounded-card border border-line bg-paper">
            {doc.guardrails.editingNote && (
              <div className="flex items-center gap-2 border-b border-line bg-paper-2 px-4 py-2.5">
                <PersonDot person={doc.guardrails.editingNote.person} size="sm" />
                <p className="text-[10.5px] text-ink-3">{doc.guardrails.editingNote.note}</p>
              </div>
            )}
            <div className="p-4">
              <p className="text-[12px] text-ink-2">{doc.guardrails.body}</p>
              {doc.guardrails.heldSuggestion && (
                <div className="mt-3 rounded-panel border border-dashed border-ultra-border bg-ultra-bg p-3">
                  <span className="inline-flex rounded-chip border border-dashed border-ultra-border px-1.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.6px] text-ultra uppercase">
                    {doc.guardrails.heldSuggestion.agent.name} suggests
                  </span>
                  <p className="mt-2 text-[11px] text-ink-2">{doc.guardrails.heldSuggestion.body}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
