import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { ADVOCACY_LOOP_NOTE, DEPARTMENT_COLORS, EYEBROW_CLASS, type Stage } from "@/pages/everyday/lifecycle/data";

export type StageRailProps = {
  stages: Stage[];
};

export function StageRail({ stages }: StageRailProps) {
  return (
    <section aria-labelledby="stage-rail-eyebrow">
      <p id="stage-rail-eyebrow" className={EYEBROW_CLASS}>
        Revenue at each stage, and what is leaking out of it
      </p>

      <div className="mt-3 flex snap-x gap-1.5 overflow-x-auto pb-2">
        {stages.map((stage) => (
          <Link
            key={stage.name}
            to={`/lifecycle/${stage.slug}`}
            className={cn(
              "w-32 shrink-0 snap-start rounded-card border border-line p-3 transition-colors hover:border-ink-4",
              stage.name === "Churn" ? "bg-rose-bg/60" : "bg-paper-2"
            )}
          >
            <span
              className="inline-block size-2 shrink-0 rounded-full"
              style={{ backgroundColor: stage.department ? DEPARTMENT_COLORS[stage.department] : "var(--color-ink-4)" }}
              aria-hidden
            />
            <p className="mt-1.5 text-[13px] font-semibold text-ink">{stage.name}</p>
            <p className="mt-0.5 truncate font-mono text-[9.5px] text-ink-4">{stage.metric}</p>
            <div className="my-2.5 border-t border-dashed border-line" />
            <p
              className={cn(
                "text-[15px] font-semibold",
                stage.amountLabel === "referred" ? "text-teal" : "text-rose"
              )}
            >
              {stage.amount}
            </p>
            <p className="font-mono text-[9px] text-ink-4">{stage.amountLabel}</p>
          </Link>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-panel border border-teal-border bg-teal-bg px-3.5 py-2.5">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-teal" aria-hidden />
        <p className="text-[11px] text-teal">{ADVOCACY_LOOP_NOTE}</p>
      </div>
    </section>
  );
}
