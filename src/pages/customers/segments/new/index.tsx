import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewSegmentRail } from "@/pages/customers/segments/new/step-rail";
import { StepWho } from "@/pages/customers/segments/new/step-who";
import { StepExcluded } from "@/pages/customers/segments/new/step-excluded";
import { StepReview } from "@/pages/customers/segments/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 3 · 162,000 match · one field, no interpretation", cta: "Next · who is left out", crumb: null },
  2: { eyebrow: "Step 2 of 3 · 13,400 excluded by the product, 21,600 by you, all named", cta: "Next · review", crumb: "Who is in it" },
  3: { eyebrow: "Step 3 of 3 · 127,000 · one near match, checked and cleared", cta: "Save the segment", crumb: "Who is left out" },
};

/**
 * SG09-SG11 — "Define a segment" wizard at /segments/new. Step position
 * lives in `?step=` (not local state) so a refresh mid-definition doesn't
 * strand the user back at step 1.
 */
const NewSegment = () => {
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
    toast.success("Saved · Single-feature customers at day 30");
    navigate("/segments");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Segments", to: "/segments" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Segments", to: "/segments" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Define a segment</h1>
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

      <NewSegmentRail active={step} />

      {step === 1 && <StepWho />}
      {step === 2 && <StepExcluded />}
      {step === 3 && <StepReview />}
    </div>
  );
};

export default NewSegment;
