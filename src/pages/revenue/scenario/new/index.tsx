import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewScenarioRail } from "@/pages/revenue/scenario/new/step-rail";
import { StepChange } from "@/pages/revenue/scenario/new/step-change";
import { StepReach } from "@/pages/revenue/scenario/new/step-reach";
import { StepAssumptions } from "@/pages/revenue/scenario/new/step-assumptions";
import { StepResult } from "@/pages/revenue/scenario/new/step-result";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 4 · what you are changing, and whether anyone has measured it before", cta: "Next · who it reaches", crumb: null },
  2: { eyebrow: "Step 2 of 4 · 931,000 in, 721,000 out, and the reason for each", cta: "Next · assumptions", crumb: "Who it reaches" },
  3: { eyebrow: "Step 3 of 4 · eight inputs, three unavailable, one weak and marked as weak", cta: "Next · the result", crumb: "Assumptions" },
  4: { eyebrow: "Step 4 of 4 · ₦188M to ₦512M, no mid-point, no profit figure", cta: "Save as S-114", crumb: "The result" },
};

/** SC04-SC07 — the "Model a change" wizard. No `?step=` param in the source footer (every step saves to the same /revenue/scenarios/new), so step state is client-local, same as Funnel's /funnel/steps/new. */
const NewScenario = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const meta = STEP_META[step];

  const handlePrimary = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    toast.success("Saved as S-114 · ₦188M – ₦512M, profit Unavailable");
    navigate("/scenario/s-114");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Scenario", to: "/scenario" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Scenario", to: "/scenario" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Model a change</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{meta.eyebrow}</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button onClick={handlePrimary}>{meta.cta}</Button>
        </div>
      </div>

      <NewScenarioRail active={step} />

      {step === 1 && <StepChange />}
      {step === 2 && <StepReach />}
      {step === 3 && <StepAssumptions />}
      {step === 4 && <StepResult />}
    </div>
  );
};

export default NewScenario;
