import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewPlaybookRail } from "@/pages/knowledge/playbooks/new/step-rail";
import { StepWhatAndWhen } from "@/pages/knowledge/playbooks/new/step-what-and-when";
import { StepPreconditions } from "@/pages/knowledge/playbooks/new/step-preconditions";
import { StepStepsAndMeasurement } from "@/pages/knowledge/playbooks/new/step-steps-measurement";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 3 · written from three runs, one of which failed and is the useful one", cta: "Next · preconditions", crumb: null },
  2: { eyebrow: "Step 2 of 3 · five conditions, two of which exist because a run went wrong", cta: "Next · steps and measurement", crumb: "Preconditions" },
  3: { eyebrow: "Step 3 of 3 · seven steps, one of which is waiting eighteen days", cta: "Write the playbook", crumb: "Steps and measurement" },
};

/**
 * PB08-PB10 — "Write a playbook" wizard at /playbooks/new. Step position
 * lives in `?step=` (not local state) so a refresh mid-write doesn't strand
 * the user, matching Business memory's /new precedent.
 */
const NewPlaybook = () => {
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
    toast.success("Written · from three runs, one of which failed");
    navigate("/playbooks");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Playbooks", to: "/playbooks" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Playbooks", to: "/playbooks" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Write a playbook</h1>
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

      <NewPlaybookRail active={step} />

      {step === 1 && <StepWhatAndWhen />}
      {step === 2 && <StepPreconditions />}
      {step === 3 && <StepStepsAndMeasurement />}
    </div>
  );
};

export default NewPlaybook;
