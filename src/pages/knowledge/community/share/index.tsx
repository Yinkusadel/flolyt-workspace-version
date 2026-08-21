import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { ShareRail } from "@/pages/knowledge/community/share/step-rail";
import { StepWhat } from "@/pages/knowledge/community/share/step-what";
import { StepLeaves } from "@/pages/knowledge/community/share/step-leaves";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · five candidates · two can never be shared and one survives as a sentence", cta: "Next · what leaves", crumb: null },
  2: { eyebrow: "Step 2 of 2 · 31 words leave · six things are stripped and five cannot be put back", cta: "Share it", crumb: "What leaves" },
};

/**
 * CM09-CM10 — "Share with the community" wizard at /community/share. Step
 * position lives in `?step=` (not local state) so a refresh mid-share
 * doesn't strand the user, matching Business memory's/Playbooks' /new
 * precedent.
 */
const Share = () => {
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
    toast.success("Shared · 31 words, unattributed");
    navigate("/community");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Community", to: "/community" }, { label: "Share" }, { label: meta.crumb }]
      : [{ label: "Community", to: "/community" }, { label: "Share" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Share with the community</h1>
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

      <ShareRail active={step} />

      {step === 1 && <StepWhat />}
      {step === 2 && <StepLeaves />}
    </div>
  );
};

export default Share;
