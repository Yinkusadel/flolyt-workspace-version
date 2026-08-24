import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { ConnectSourceRail } from "@/pages/data/data-sources/new/step-rail";
import { StepWhat } from "@/pages/data/data-sources/new/step-what";
import { StepFields } from "@/pages/data/data-sources/new/step-fields";
import { StepHow } from "@/pages/data/data-sources/new/step-how";
import { StepReview } from "@/pages/data/data-sources/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 4 · four candidates, one of which does not exist to connect", cta: "Next · which fields", crumb: null },
  2: { eyebrow: "Step 2 of 4 · four of nine fields · and the one that was hardest to leave", cta: "Next · how and how often", crumb: "What to connect" },
  3: { eyebrow: "Step 3 of 4 · a nightly file, and what a nightly file means for every figure after it", cta: "Next · review", crumb: "Which fields" },
  4: { eyebrow: "Step 4 of 4 · eleven figures unblocked, one still refused, and the blocker is a conversation", cta: "Request the connection", crumb: "How and how often" },
};

/**
 * DS07-DS10 — "Connect a source" wizard at /data-sources/new. Step position
 * lives in `?step=` (not local state) so a refresh mid-flow doesn't strand
 * the user back at step 1.
 */
const NewDataSource = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Math.min(4, Math.max(1, Number(searchParams.get("step") ?? "1")));
  const meta = STEP_META[step];

  const goToStep = (n: number) => setSearchParams(n === 1 ? {} : { step: String(n) });

  const handlePrimary = () => {
    if (step < 4) {
      goToStep(step + 1);
      return;
    }
    toast.success("Requested · waiting on Finance");
    navigate("/data-sources");
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Data sources", to: "/data-sources" }, { label: "Connect" }, { label: meta.crumb }]
      : [{ label: "Data sources", to: "/data-sources" }, { label: "Connect" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Connect a source</h1>
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

      <ConnectSourceRail active={step} />

      {step === 1 && <StepWhat />}
      {step === 2 && <StepFields />}
      {step === 3 && <StepHow />}
      {step === 4 && <StepReview />}
    </div>
  );
};

export default NewDataSource;
