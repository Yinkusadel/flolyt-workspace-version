import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewStepRail } from "@/pages/revenue/funnel/new-step/step-rail";
import { StepWhat } from "@/pages/revenue/funnel/new-step/step-what";
import { StepEvent } from "@/pages/revenue/funnel/new-step/step-event";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · what it is and where it sits", cta: "Next · the event", crumb: null },
  2: { eyebrow: "Step 2 of 2 · mapped to an event that has never fired, deliberately", cta: "Create the step", crumb: "The event" },
};

/** FN08/FN09 — the "Define a step" wizard. No `?step=` param in the source footer, so step state is client-local, same as Goals' /goals/new. */
const NewFunnelStep = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const meta = STEP_META[step];

  const handlePrimary = () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    toast.success("Step created · reads Unavailable until the event fires");
    navigate("/funnel");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Funnel", to: "/funnel" }, { label: "New step" }, { label: meta.crumb }]
      : [{ label: "Funnel", to: "/funnel" }, { label: "New step" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Define a funnel step</h1>
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

      <NewStepRail active={step} />

      {step === 1 && <StepWhat />}
      {step === 2 && <StepEvent />}
    </div>
  );
};

export default NewFunnelStep;
