import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Workspace", "Business model", "Your data", "Your agents", "Your team"];

interface WizardStepperProps {
  /** 1-indexed — which step is currently active. Earlier steps render as complete. */
  activeStep: number;
}

/** Matches the step-dot row baked into every onboarding SVG (03-07). */
export function WizardStepper({ activeStep }: WizardStepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-6">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isComplete = step < activeStep;
        const isActive = step === activeStep;

        return (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  "h-px w-6 border-t border-dashed",
                  isComplete || isActive ? "border-teal" : "border-line"
                )}
              />
            )}

            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex size-page shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold",
                  isComplete && "bg-teal text-white",
                  isActive && "bg-ultra text-white",
                  !isComplete && !isActive && "bg-paper-2 text-ink-4"
                )}
              >
                {isComplete ? <Check className="size-3" /> : step}
              </span>
              <span
                className={cn(
                  "hidden text-[12.5px] sm:inline",
                  isActive ? "font-semibold text-ink" : isComplete ? "text-ink-3" : "font-normal text-ink-4"
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
