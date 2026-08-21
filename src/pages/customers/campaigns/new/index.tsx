import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewCampaignRail } from "@/pages/customers/campaigns/new/step-rail";
import { StepWho } from "@/pages/customers/campaigns/new/step-who";
import { StepWhat } from "@/pages/customers/campaigns/new/step-what";
import { StepGuardrails } from "@/pages/customers/campaigns/new/step-guardrails";
import { StepReview } from "@/pages/customers/campaigns/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 4 · 100,000 in the segment, 42,300 reachable today, and the reason for the gap", cta: "Next · what it says", crumb: null },
  2: { eyebrow: "Step 2 of 4 · five checks, one blocking · the copy describes a change that has not shipped", cta: "Fix the copy", crumb: "What it says" },
  3: { eyebrow: "Step 3 of 4 · five applied to you, five set by you, one of them required", cta: "Next · review", crumb: "Guardrails" },
  4: { eyebrow: "Step 4 of 4 · 38,070 of 100,000 · six commitments, five of them permanent", cta: "Send for approval", crumb: "Review" },
};

/**
 * CP09-CP12 — "New campaign" wizard at /campaigns/new. Step position lives
 * in `?step=` (not local state), same rule Segments' wizard established.
 */
const NewCampaign = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Math.min(4, Math.max(1, Number(searchParams.get("step") ?? "1")));
  const meta = STEP_META[step];

  const goToStep = (n: number) => setSearchParams(n === 1 ? {} : { step: String(n) });

  const handlePrimary = () => {
    if (step < 4) {
      if (step === 2) toast.info("Copy edited · the shipped-change claim removed");
      goToStep(step + 1);
      return;
    }
    toast.success("Sent for approval · waiting on Ada");
    navigate("/campaigns/waiting");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Campaigns", to: "/campaigns" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Campaigns", to: "/campaigns" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">New campaign</h1>
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

      <NewCampaignRail active={step} />

      {step === 1 && <StepWho />}
      {step === 2 && <StepWhat />}
      {step === 3 && <StepGuardrails />}
      {step === 4 && <StepReview />}
    </div>
  );
};

export default NewCampaign;
