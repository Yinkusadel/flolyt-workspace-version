import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewHoldoutRail } from "@/pages/revenue/attribution/new-holdout/step-rail";
import { StepSize } from "@/pages/revenue/attribution/new-holdout/step-size";
import { StepExclusions } from "@/pages/revenue/attribution/new-holdout/step-exclusions";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · four sizes, no recommendation, and what each costs", cta: "Next · exclusions", crumb: null },
  2: { eyebrow: "Step 2 of 2 · 8,140 people removed, five days added, and no way to buy them back", cta: "Start the holdout", crumb: "Exclusions" },
};

/** AT11/AT12 — the "Design a holdout" wizard. No `?step=` param in the source footer (both steps save to the same /revenue/attribution/holdouts/new), so step state is client-local, same as Funnel's and Scenario's wizards. */
const NewHoldout = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const meta = STEP_META[step];

  const handlePrimary = () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    toast.success("Holdout started · 1,586 held at 10%, ending 14 September");
    navigate("/attribution/holdouts");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Attribution", to: "/attribution" }, { label: "New holdout" }, { label: meta.crumb }]
      : [{ label: "Attribution", to: "/attribution" }, { label: "New holdout" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Design a holdout</h1>
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

      <NewHoldoutRail active={step} />

      {step === 1 && <StepSize />}
      {step === 2 && <StepExclusions />}
    </div>
  );
};

export default NewHoldout;
