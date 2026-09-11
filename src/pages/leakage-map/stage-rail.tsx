import { cn } from "@/lib/utils";
import { Callout } from "@/components/ui/rail";
import { FloatingCard } from "@/pages/leakage-map/floating-card";
import { StageDetailCard } from "@/pages/leakage-map/detail-panel";
import { ADVOCACY_NOTE_BODY, ADVOCACY_NOTE_TITLE, STAGES, type Stage } from "@/pages/leakage-map/data";

const VALUE_TONE_CLASS: Record<Stage["valueTone"], string> = {
  rose: "text-rose",
  teal: "text-teal",
};

function StageCard({ stage }: { stage: Stage }) {
  return (
    <FloatingCard
      align="start"
      panelClassName="w-80 max-w-[calc(100vw-2rem)]"
      renderTrigger={({ open, toggle, ref }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          className={cn(
            "flex min-h-32 w-full flex-col rounded-card border border-transparent bg-paper-2 p-4 text-left transition-all",
            "hover:border-line hover:bg-paper",
            open && "border-ultra bg-paper shadow-md"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] font-medium text-ink-4">{stage.number}</span>
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: stage.dot }} aria-hidden />
          </div>
          <p className="mt-2 text-[13.5px] font-semibold text-ink">{stage.label}</p>
          <p className="mt-1 text-[11px] leading-snug text-ink-4">
            {stage.metricLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="mt-auto border-t border-dashed border-line pt-2.5">
            <p className={cn("text-[15px] font-semibold", VALUE_TONE_CLASS[stage.valueTone])}>{stage.value}</p>
          </div>
        </button>
      )}
    >
      <StageDetailCard stage={stage} />
    </FloatingCard>
  );
}

export function StageRail() {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
        Revenue at each stage, and what is leaking out of it
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
        {STAGES.map((stage) => (
          <StageCard key={stage.id} stage={stage} />
        ))}
      </div>
      <Callout tone="teal" title={ADVOCACY_NOTE_TITLE}>
        {ADVOCACY_NOTE_BODY}
      </Callout>
    </div>
  );
}
