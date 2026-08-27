import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import useUpdateRevenueModel from "@/features/workspace/use-update-revenue-model";
import useStepUpConfirmation from "@/features/auth/use-step-up-confirmation";
import { REVENUE_MODELS } from "@/validators/workspace";

const REVENUE_MODEL_META = {
  consumer: {
    label: "Consumer",
    description: "You sell to individual people.",
    bullets: [
      "2,000 to 10M+ customers",
      "Rooms open on cohorts and behaviours",
      "Repeat purchase, dunning, abandonment",
      "Audiences in the hundreds of thousands",
    ],
    changes: [
      { eyebrow: "A room is about", value: "a cohort, not a person" },
      { eyebrow: "Conditions become", value: "repeat decay · dunning · abandonment · refunds" },
      { eyebrow: "Audiences are", value: "sampled and frequency-capped" },
      { eyebrow: "Currency follows", value: "each customer's market" },
    ],
  },
  account_based: {
    label: "Account-based",
    description: "You sell to companies with named contacts.",
    bullets: [
      "Tens to thousands of accounts",
      "Rooms open on one account",
      "Seats, renewals, escalations, expansion",
      "Audiences you can read end to end",
    ],
    changes: [
      { eyebrow: "A room is about", value: "one account, not a person" },
      { eyebrow: "Conditions become", value: "renewal · expansion · seat changes · escalation" },
      { eyebrow: "Audiences are", value: "read end to end, not sampled" },
      { eyebrow: "Currency follows", value: "each customer's market" },
    ],
  },
  both: {
    label: "Both",
    description: "Self-serve consumers and an enterprise tier.",
    bullets: [
      "Two vocabularies, one workspace",
      "Rooms declare which they are",
      "Memory is kept separate by model",
      "Most marketplaces land here",
    ],
    changes: [
      { eyebrow: "A room is about", value: "a cohort or one account, whichever the sale was" },
      { eyebrow: "Conditions become", value: "both vocabularies, kept separate per room" },
      { eyebrow: "Audiences are", value: "sampled for consumer, read whole for accounts" },
      { eyebrow: "Currency follows", value: "each customer's market" },
    ],
  },
} as const;

/**
 * Onboarding step 2 ("Business model") — flolyt-figma-designs/onboarding/04-business-model.svg.
 * Sets the closed vocabulary the leakage grid branches on (PUT /revenue-model), always
 * step-up gated per the handoff doc. Defaults to "consumer" — the SVG's own drawn state
 * has it pre-selected. The "what changes" panel copy for Account-based and Both is
 * written to match Consumer's, since the export only draws Consumer's selected state.
 * No "this discards your leakage grid" confirmation here — that only applies to an
 * existing workspace changing an already-set model, never a first-time onboarding pick.
 */
export default function OnboardingBusinessModelRoute() {
  const navigate = useNavigate();

  const revenueModel = useUpdateRevenueModel({
    defaultValues: { revenueModel: "consumer" },
    onSuccess: () => {
      toast.success("Business model set — on to your data next");
      navigate("/onboarding/data");
    },
  });

  const stepUp = useStepUpConfirmation({
    action: "change_revenue_model",
    onConfirmed: (challengeId) => {
      revenueModel.form.setValue("stepUpChallengeId", challengeId);
      revenueModel.form.handleSubmit(revenueModel.onSubmit)();
    },
  });

  const { watch, setValue } = revenueModel.form;
  const selected = watch("revenueModel");
  const meta = REVENUE_MODEL_META[selected as keyof typeof REVENUE_MODEL_META] ?? REVENUE_MODEL_META.consumer;

  const handleContinue = async () => {
    const valid = await revenueModel.form.trigger();
    if (!valid) {
      toast.error("Pick a business model before continuing");
      return;
    }
    stepUp.begin();
  };

  const canContinue = !revenueModel.isPending && !stepUp.isRequesting;

  return (
    <div>
      <WizardStepper activeStep={2} />

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <h1 className="text-[22px] font-semibold text-ink">How does your business make money?</h1>
        <p className="mt-2 max-w-2xl text-[12.5px] text-ink-3">
          This is not a preference. It decides what a room is about, which revenue conditions the
          agents look for, and whether an audience is forty people or four hundred thousand.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {REVENUE_MODELS.map((model) => {
            const option = REVENUE_MODEL_META[model];
            const isSelected = selected === model;
            return (
              <button
                key={model}
                type="button"
                onClick={() => setValue("revenueModel", model, { shouldValidate: true })}
                className={`rounded-panel border p-5 text-left transition-colors ${
                  isSelected ? "border-ultra-border bg-paper" : "border-line bg-paper-2"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[17px] font-semibold text-ink">{option.label}</p>
                    <p className="mt-1 text-[12px] text-ink-3">{option.description}</p>
                  </div>
                  {isSelected && (
                    <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-ultra text-[9px] text-white">
                      ✓
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-2 border-t border-line pt-4">
                  {option.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[11.5px] text-ink-2">
                      <span
                        className={`mt-1.5 size-1.25 shrink-0 rounded-full ${isSelected ? "bg-ultra" : "bg-ink-4"}`}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-panel border border-ultra-border bg-ultra-bg p-5">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What {meta.label} changes
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {meta.changes.map((change) => (
              <div key={change.eyebrow}>
                <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ultra uppercase">
                  {change.eyebrow}
                </p>
                <p className="mt-1.5 text-[11.5px] text-ink-2">{change.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[11.5px] text-ink-4">
          You can change this later, but it rewrites the vocabulary of every room.
        </p>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="mt-6 h-10.5 rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90"
        >
          {revenueModel.isPending || stepUp.isRequesting ? "Saving..." : `Continue as ${meta.label}`}
        </Button>
      </div>

      <StepUpConfirmModal
        open={stepUp.isOpen}
        onOpenChange={stepUp.close}
        title="Confirm your business model"
        description="Setting how you make money needs a fresh code — check your email."
        isRequesting={stepUp.isRequesting}
        isVerifying={stepUp.isVerifying}
        onVerify={stepUp.verify}
        onResend={stepUp.resend}
      />
    </div>
  );
}
