import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { METRIC_OPTIONS } from "@/pages/goals/new/data";

/** G02 — New goal · the metric. */
export function StepMetric() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What do you want to move?
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {METRIC_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3.5 sm:items-center",
                option.blocked ? "bg-paper-2" : option.selected && "bg-ultra-bg"
              )}
            >
              {option.blocked ? (
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-rose-border text-rose sm:mt-0">
                  <X className="size-2.5" />
                </span>
              ) : (
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 sm:mt-0",
                    option.selected ? "border-ultra bg-ultra" : "border-line"
                  )}
                >
                  {option.selected && <span className="size-1.5 rounded-full bg-white" />}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("text-[12.5px] font-semibold", option.blocked ? "text-ink-4" : "text-ink")}>
                  {option.name}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-3">{option.description}</p>
                <Chip tone="neutral" className="mt-2 sm:hidden">
                  {option.tag}
                </Chip>
              </div>
              <Chip tone="neutral" className="hidden shrink-0 sm:inline-flex">
                {option.tag}
              </Chip>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="amber" title="A rate and a count are different goals and Flolyt will not let you blur them">
        "Second orders" goes up when you acquire more customers, even if each one is worth less. "90-day repeat rate"
        only goes up when acquired customers behave better. Both are legitimate. Setting both without noticing they
        can pull against each other is how a quarter ends in an argument — and it has already happened once here.
      </Callout>
    </div>
  );
}
