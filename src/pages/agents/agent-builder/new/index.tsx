import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { NewAgentRail } from "@/pages/agents/agent-builder/new/step-rail";
import { StepWatches } from "@/pages/agents/agent-builder/new/step-watches";
import { StepReads } from "@/pages/agents/agent-builder/new/step-reads";
import { StepConditions } from "@/pages/agents/agent-builder/new/step-conditions";
import { StepRouting } from "@/pages/agents/agent-builder/new/step-routing";
import { StepClaims } from "@/pages/agents/agent-builder/new/step-claims";
import { StepReview } from "@/pages/agents/agent-builder/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 6 · started from a condition that has been routing nowhere since June", cta: "Next · what it reads", crumb: null },
  2: { eyebrow: "Step 2 of 6 · two sources granted, two declined, one you cannot grant at all", cta: "Next · conditions", crumb: "What it reads" },
  3: { eyebrow: "Step 3 of 6 · four candidates tested against history · one would have fired 412 times", cta: "Next · where findings go", crumb: "Conditions" },
  4: { eyebrow: "Step 4 of 6 · three real destinations, two refused, and everybody's load is shown", cta: "Next · what it may say", crumb: "Where findings go" },
  5: { eyebrow: "Step 5 of 6 · two claim types available, two refused by what it can read", cta: "Next · review", crumb: "What it may say" },
  6: { eyebrow: "Step 6 of 6 · six choices, two of them not changeable, and none that grants a new power", cta: "Test it against history", crumb: "Review" },
};

/**
 * AB04-AB09 — "Build an agent" wizard at /agent-builder/new. Step position
 * lives in `?step=` (not local state), same rule Experiments' wizard
 * established, per [[url_param_over_state_for_page_flow]].
 */
const NewAgent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Math.min(6, Math.max(1, Number(searchParams.get("step") ?? "1")));
  const meta = STEP_META[step];

  const goToStep = (n: number) => setSearchParams(n === 1 ? {} : { step: String(n) });

  const handlePrimary = () => {
    if (step < 6) {
      goToStep(step + 1);
      return;
    }
    toast.success("Release Watch built · running it against the last eight months");
    navigate("/agent-builder/test-runs");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Agent Builder", to: "/agent-builder" }, { label: "New" }, { label: meta.crumb }]
      : [{ label: "Agent Builder", to: "/agent-builder" }, { label: "New" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Build an agent</h1>
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

      <NewAgentRail active={step} />

      {step === 1 && <StepWatches />}
      {step === 2 && <StepReads />}
      {step === 3 && <StepConditions />}
      {step === 4 && <StepRouting />}
      {step === 5 && <StepClaims />}
      {step === 6 && <StepReview />}
    </div>
  );
};

export default NewAgent;
