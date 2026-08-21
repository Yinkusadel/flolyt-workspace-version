import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewExperimentRail } from "@/pages/customers/experiments/new/step-rail";
import { StepQuestion } from "@/pages/customers/experiments/new/step-question";
import { StepHoldout } from "@/pages/customers/experiments/new/step-holdout";
import { StepReview } from "@/pages/customers/experiments/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 3 · five fields, four of them locked once it starts", cta: "Next · the holdout", crumb: null },
  2: { eyebrow: "Step 2 of 3 · four sizes, no recommendation · 18,000 removed and no way to buy them back", cta: "Next · review", crumb: "The holdout" },
  3: { eyebrow: "Step 3 of 3 · seven fields, five locked · the first test of the 43-point signal", cta: "Sign and start", crumb: "Review" },
};

/**
 * XP09-XP11 — "Design an experiment" wizard at /experiments/new. Step
 * position lives in `?step=` (not local state), same rule Segments' wizard
 * established.
 */
const NewExperiment = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Math.min(3, Math.max(1, Number(searchParams.get("step") ?? "1")));
  const meta = STEP_META[step];

  const goToStep = (n: number) => setSearchParams(n === 1 ? {} : { step: String(n) });

  const handlePrimary = () => {
    if (step < 3) {
      goToStep(step + 1);
      return;
    }
    toast.success("Signed and started · Zainab re-authenticated");
    navigate("/experiments");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Experiments", to: "/experiments" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Experiments", to: "/experiments" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Design an experiment</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{meta.eyebrow}</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          {step > 1 && (
            <Button variant="outline" onClick={() => goToStep(step - 1)}>
              Back
            </Button>
          )}
          <Button onClick={handlePrimary}>{meta.cta}</Button>
        </div>
      </div>

      <NewExperimentRail active={step} />

      {step === 1 && <StepQuestion />}
      {step === 2 && <StepHoldout />}
      {step === 3 && <StepReview />}
    </div>
  );
};

export default NewExperiment;
