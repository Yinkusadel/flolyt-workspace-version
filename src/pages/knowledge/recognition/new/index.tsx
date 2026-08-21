import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { RecogniseRail } from "@/pages/knowledge/recognition/new/step-rail";
import { StepAct } from "@/pages/knowledge/recognition/new/step-act";
import { StepWhy } from "@/pages/knowledge/recognition/new/step-why";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · five kinds · one of them is never offered", cta: "Next · why it counts", crumb: null },
  2: { eyebrow: "Step 2 of 2 · five required fields, one of which is what it cost them", cta: "Recognise it", crumb: "Why it counts" },
};

/**
 * RC09-RC10 — "Recognise somebody" wizard at /recognition/new. Step position
 * lives in `?step=` (not local state) so a refresh mid-write doesn't strand
 * the user, matching Business memory's/Playbooks'/Community's `/new`
 * (`/share`) precedent.
 */
const RecogniseSomebody = () => {
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
    toast.success("Recognised · visible to everybody, permanently");
    navigate("/recognition");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Recognition", to: "/recognition" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Recognition", to: "/recognition" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Recognise somebody</h1>
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

      <RecogniseRail active={step} />

      {step === 1 && <StepAct />}
      {step === 2 && <StepWhy />}
    </div>
  );
};

export default RecogniseSomebody;
