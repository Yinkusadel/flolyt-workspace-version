import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewLearningRail } from "@/pages/knowledge/business-memory/new/step-rail";
import { StepClaim } from "@/pages/knowledge/business-memory/new/step-claim";
import { StepScope } from "@/pages/knowledge/business-memory/new/step-scope";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · four kinds · one reading means the strongest one is not offered", cta: "Next · scope and evidence", crumb: null },
  2: { eyebrow: "Step 2 of 2 · six required fields, two of them about how it will be misread", cta: "Write it", crumb: "The claim" },
};

/**
 * ME12-ME13 — "Write a learning" wizard at /business-memory/new. Step
 * position lives in `?step=` (not local state) so a refresh mid-write
 * doesn't strand the user, matching Segments' /new precedent.
 */
const NewLearning = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Math.min(2, Math.max(1, Number(searchParams.get("step") ?? "1")));
  const meta = STEP_META[step];

  const goToStep = (n: number) => setSearchParams(n === 1 ? {} : { step: String(n) });

  const handlePrimary = () => {
    if (step < 2) {
      goToStep(step + 1);
      return;
    }
    toast.success("Written · an observation, scoped to Nigeria and Kenya");
    navigate("/business-memory");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Business memory", to: "/business-memory" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Business memory", to: "/business-memory" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Write a learning</h1>
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

      <NewLearningRail active={step} />

      {step === 1 && <StepClaim />}
      {step === 2 && <StepScope />}
    </div>
  );
};

export default NewLearning;
