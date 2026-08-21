import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewComparisonRail } from "@/pages/revenue/benchmarks/new/step-rail";
import { StepMatching } from "@/pages/revenue/benchmarks/new/step-matching";
import { StepWhat } from "@/pages/revenue/benchmarks/new/step-what";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · two numbers, four possible bases, and only one of them causal", cta: "Next · what has to match", crumb: null },
  2: { eyebrow: "Step 2 of 2 · five checks pass, one fails, and the failure travels with the result", cta: "Save the comparison", crumb: "What has to match" },
};

/** BM11/BM12 — the "Build a comparison" wizard. No `?step=` param in the source footer (both steps save to the same /revenue/benchmarks/new), so step state is client-local, same as every prior section's wizard. */
const NewComparison = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const meta = STEP_META[step];

  const handlePrimary = () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    toast.success("Comparison saved · repeat rate, Nigeria against the UK");
    navigate("/benchmarks/repeat-rate");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Benchmarks", to: "/benchmarks" }, { label: "New comparison" }, { label: meta.crumb }]
      : [{ label: "Benchmarks", to: "/benchmarks" }, { label: "New comparison" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Build a comparison</h1>
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

      <NewComparisonRail active={step} />

      {step === 1 && <StepWhat />}
      {step === 2 && <StepMatching />}
    </div>
  );
};

export default NewComparison;
