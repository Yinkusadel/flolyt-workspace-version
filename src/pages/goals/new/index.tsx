import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { StepRail } from "@/pages/goals/new/step-rail";
import { StepMetric } from "@/pages/goals/new/step-metric";
import { StepBaseline } from "@/pages/goals/new/step-baseline";
import { StepTarget } from "@/pages/goals/new/step-target";
import { StepLevers } from "@/pages/goals/new/step-levers";
import { StepReview } from "@/pages/goals/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 5 · four metrics available, one blocked", cta: "Next · the baseline", crumb: null },
  2: {
    eyebrow: "Step 2 of 5 · 27.2% measured over 894,000 customers · and it contains a known problem",
    cta: "Next · target and owner",
    crumb: "The baseline",
  },
  3: {
    eyebrow: "Step 3 of 5 · 36.4% by 31 March · Flolyt thinks this is ambitious and says so",
    cta: "Next · what moves it",
    crumb: "Target and owner",
  },
  4: {
    eyebrow: "Step 4 of 5 · six levers move this metric and one of them is yours",
    cta: "Next · review",
    crumb: "What moves it",
  },
  5: {
    eyebrow: "Step 5 of 5 · the baseline locks on save, the target does not",
    cta: "Set the goal",
    crumb: "Review",
  },
};

/** G02–G06 — the "Set a goal" wizard. No `?step=` param in any source footer, so step state is client-local. */
const NewGoal = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);

  const meta = STEP_META[step];

  const handlePrimary = () => {
    if (step < 5) {
      setStep(step + 1);
      return;
    }
    navigate("/goals/repeat-90");
  };

  const goToStep = (target: number) => setStep(target);
  const handleBack = () => {
    if (step > 1) goToStep(step - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Set a goal</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{meta.eyebrow}</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handlePrimary}>{meta.cta}</Button>
        </div>
      </div>

      <p className="font-mono text-[10.5px] text-ink-4">
        <Link to="/goals" className="hover:text-ink-3">
          Goals
        </Link>
        <span className="mx-1.5">›</span>
        {meta.crumb ? (
          <>
            <Link to="/goals/new" onClick={() => setStep(1)} className="hover:text-ink-3">
              New goal
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-ink-3">{meta.crumb}</span>
          </>
        ) : (
          <span className="text-ink-3">New goal</span>
        )}
      </p>

      <StepRail active={step} onStepClick={goToStep} />

      {step === 1 && <StepMetric />}
      {step === 2 && <StepBaseline />}
      {step === 3 && <StepTarget />}
      {step === 4 && <StepLevers />}
      {step === 5 && <StepReview />}
    </div>
  );
};

export default NewGoal;
