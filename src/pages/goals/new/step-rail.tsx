import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = ["The metric", "The baseline", "Target and owner", "What moves it", "Review"];

/** The 5-pill wizard rail shared by every `/goals/new` step (G02–G06). Completed pills are clickable to go back. */
export function StepRail({ active, onStepClick }: { active: number; onStepClick?: (step: number) => void }) {
  return (
    <>
      <div className="hidden gap-2 overflow-x-auto sm:flex">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < active;
          const isActive = stepNum === active;
          const clickable = done && !!onStepClick;
          const pillClass = cn(
            "flex min-w-[150px] flex-1 shrink-0 items-center gap-2 rounded-panel border px-3 py-2.5",
            isActive
              ? "border-2 border-ultra-border bg-paper"
              : done
                ? "border-line bg-paper"
                : "border-line bg-paper-2",
            clickable && "cursor-pointer hover:bg-paper-2"
          );
          const content = (
            <>
              {done ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                  <Check className="size-3" />
                </span>
              ) : (
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold",
                    isActive ? "bg-ultra text-white" : "bg-paper-2 text-ink-4"
                  )}
                >
                  {stepNum}
                </span>
              )}
              <span
                className={cn(
                  "text-[11px] whitespace-nowrap",
                  isActive ? "font-semibold text-ink" : done ? "text-ink-2" : "text-ink-4"
                )}
              >
                {label}
              </span>
            </>
          );
          return clickable ? (
            <button key={label} type="button" onClick={() => onStepClick!(stepNum)} className={pillClass}>
              {content}
            </button>
          ) : (
            <div key={label} className={pillClass}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="flex items-center sm:hidden">
        {STEPS.map((_, i) => {
          const stepNum = i + 1;
          const done = stepNum < active;
          const isActive = stepNum === active;
          const clickable = done && !!onStepClick;
          const dotClass = cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold transition-colors",
            done ? "bg-teal text-white" : isActive ? "bg-ultra text-white" : "bg-paper-2 text-ink-4",
            clickable && "cursor-pointer hover:opacity-80"
          );
          const dot = done ? <Check className="size-3.5" /> : stepNum;
          return (
            <React.Fragment key={stepNum}>
              {i > 0 && <div className={cn("h-px w-6 shrink-0", stepNum <= active ? "bg-teal" : "bg-line")} />}
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick!(stepNum)}
                  className={dotClass}
                  aria-label={`Go to step ${stepNum}`}
                >
                  {dot}
                </button>
              ) : (
                <div className={dotClass} aria-current={isActive ? "step" : undefined}>
                  {dot}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
