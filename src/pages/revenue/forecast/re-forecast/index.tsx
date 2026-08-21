import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { ReForecastRail } from "@/pages/revenue/forecast/re-forecast/step-rail";
import { StepWhatChanged } from "@/pages/revenue/forecast/re-forecast/step-what-changed";
import { StepYourNumber } from "@/pages/revenue/forecast/re-forecast/step-your-number";
import { FC_DETAIL_TITLES } from "@/pages/revenue/forecast/data";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 2 · five changes, two of which cannot be turned into a number", cta: "Next · your number", crumb: null },
  2: { eyebrow: "Step 2 of 2 · four required fields, and the headline cannot be moved on its own", cta: "Sign 87.6%", crumb: "Your number" },
};

/** FC08/FC09 — the "Re-forecast" wizard. No `?step=` param in the source footer (both frames save to the same /revenue/forecast/:stage/re-forecast route), so step state is client-local, same as every prior section's wizard. */
const NewReForecast = () => {
  const { stage } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const meta = STEP_META[step];
  const stageTitle = stage ? (FC_DETAIL_TITLES[stage] ?? stage) : "Renew";

  const handlePrimary = () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    toast.success("Re-forecast signed · 87.6%, down 0.6 points, account coverage named");
    navigate(`/forecast/${stage}`);
  };

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Forecast", to: "/forecast" }, { label: stageTitle, to: `/forecast/${stage}` }, { label: "Re-forecast" }, { label: meta.crumb }]
      : [{ label: "Forecast", to: "/forecast" }, { label: stageTitle, to: `/forecast/${stage}` }, { label: "Re-forecast" }]
  );

  if (stage !== "renew") {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Re-forecast not available for this stage</p>
        <Link to="/forecast" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to forecast
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Re-forecast · {stageTitle}</h1>
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

      <ReForecastRail active={step} />

      {step === 1 && <StepWhatChanged />}
      {step === 2 && <StepYourNumber />}
    </div>
  );
};

export default NewReForecast;
