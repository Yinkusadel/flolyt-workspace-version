import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = ["The claim", "Scope and evidence"];

/** The 2-pill wizard rail for /business-memory/new (ME12-ME13). */
export function NewLearningRail({ active }: { active: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < active;
        const isActive = stepNum === active;
        return (
          <div
            key={label}
            className={cn(
              "flex min-w-[130px] flex-1 shrink-0 items-center gap-2 rounded-panel border px-3 py-2.5",
              isActive ? "border-2 border-ultra-border bg-paper" : done ? "border-line bg-paper" : "border-line bg-paper-2"
            )}
          >
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
            <span className={cn("text-[11px] whitespace-nowrap", isActive ? "font-semibold text-ink" : done ? "text-ink-2" : "text-ink-4")}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
