import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { StepRail } from "@/pages/everyday/rooms/new/step-rail";
import { StepCondition, type ConditionStepValue } from "@/pages/everyday/rooms/new/step-condition";
import { StepAudience } from "@/pages/everyday/rooms/new/step-audience";
import { StepPeople } from "@/pages/everyday/rooms/new/step-people";
import { StepSettle } from "@/pages/everyday/rooms/new/step-settle";
import { StepDuplicate } from "@/pages/everyday/rooms/new/step-duplicate";
import { StepReview } from "@/pages/everyday/rooms/new/step-review";

const STEP_META: Record<number, { eyebrow: string; cta: string; crumb: string | null }> = {
  1: { eyebrow: "Step 1 of 5 · a room is about a cohort in a condition", cta: "Next · who is in it", crumb: null },
  2: { eyebrow: "Step 2 of 5 · 148,000 match · 100,000 are reachable", cta: "Next · who is in the room", crumb: "Who is in it" },
  3: { eyebrow: "Step 3 of 5 · one decision owner, four people, three agents", cta: "Next · what would settle it", crumb: "Who is in the room" },
  4: { eyebrow: "Step 4 of 5 · written before the answer is known", cta: "Next · review", crumb: "What would settle it" },
  5: { eyebrow: "Step 5 of 5 · nothing here is final · everything is editable inside the room", cta: "Open the room", crumb: "Review" },
};

/** R06–R11 — the "Open a war room" wizard. No `?step=` param in any source footer, so step state is client-local. */

/**
 * Whole-form state, shaped after `POST /rooms/new`'s body up front — one slice per step, all
 * present from the start so the TEMP DEBUG log below always shows the full shape, even for
 * steps whose UI isn't wired to real controls yet (those slices just stay at their empty
 * default until that step's own wiring pass fills them in for real).
 */
interface NewRoomForm {
  /** Step 1 — wired. */
  condition: ConditionStepValue;
  /** Step 2 — NOT wired yet; step-audience.tsx still renders static mock rows. */
  audience: {
    rules: unknown[]; // CreateSegmentRuleInput[]
    currency: string | null;
  };
  /** Step 3 — NOT wired yet; step-people.tsx still renders static mock rows. */
  people: {
    people: unknown[]; // { userId, role, maxApprovalReach }[]
    agents: unknown[]; // { key, role, whatItWillDo, reads }[]
  };
  /** Step 4 — NOT wired yet; step-settle.tsx still renders static mock rows. */
  settle: {
    settlesWhen: string[];
    measuredOverDays: number | null;
    primaryMeasure: string | null;
    revenueBasis: string | null;
    holdoutPercent: number | null;
    noHoldoutBecause: string | null;
    wouldProveUsWrong: string | null;
  };
  /** Step 5 — NOT wired yet; only produced by the duplicate-detection interstitial. */
  review: {
    linkToRoomId: string | null;
    linkReason: string | null;
    openDespiteOverlapWith: string[];
  };
}

const INITIAL_FORM: NewRoomForm = {
  condition: { title: "", conditionKey: null },
  audience: { rules: [], currency: null },
  people: { people: [], agents: [] },
  settle: {
    settlesWhen: [],
    measuredOverDays: null,
    primaryMeasure: null,
    revenueBasis: null,
    holdoutPercent: null,
    noHoldoutBecause: null,
    wouldProveUsWrong: null,
  },
  review: { linkToRoomId: null, linkReason: null, openDespiteOverlapWith: [] },
};

const NewRoom = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [showDuplicate, setShowDuplicate] = React.useState(false);
  const [linked, setLinked] = React.useState(false);
  const [form, setForm] = React.useState<NewRoomForm>(INITIAL_FORM);

  // TEMP DEBUG — remove once the new-room wizard's fields are all wired and reviewed.
  React.useEffect(() => {
    console.log("[new-room] whole form:", form);
  }, [form]);

  const meta = showDuplicate
    ? { eyebrow: "Step 5 of 5 · 91,400 customers are already in another room", cta: "Open the room", crumb: "Review" }
    : STEP_META[step];

  const handlePrimary = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    if (step === 4) {
      setShowDuplicate(true);
      setStep(5);
      return;
    }
    // step 5, review or duplicate screen
    if (showDuplicate) return; // buttons on the duplicate screen handle their own transitions
    navigate("/rooms/second-order-never-happened");
  };

  const goToStep = (target: number) => {
    setShowDuplicate(false);
    setStep(target);
  };

  const handleBack = () => {
    if (showDuplicate) {
      goToStep(4);
      return;
    }
    if (step > 1) goToStep(step - 1);
  };

  const canGoBack = step > 1 || showDuplicate;

  usePageBreadcrumb(
    meta.crumb
      ? [{ label: "Rooms", to: "/rooms" }, { label: "New room" }, { label: meta.crumb }]
      : [{ label: "Rooms", to: "/rooms" }, { label: "New room" }]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Open a war room</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{meta.eyebrow}</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          {canGoBack && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handlePrimary}>{meta.cta}</Button>
        </div>
      </div>

      <StepRail active={step} onStepClick={goToStep} />

      {step === 1 && (
        <StepCondition
          value={form.condition}
          onChange={(condition) => setForm((f) => ({ ...f, condition }))}
        />
      )}
      {step === 2 && <StepAudience />}
      {step === 3 && <StepPeople />}
      {step === 4 && <StepSettle />}
      {step === 5 && showDuplicate && (
        <StepDuplicate
          onJoin={() => navigate("/rooms/checkout-abandoned-at-delivery-fee")}
          onLinked={() => {
            setLinked(true);
            setShowDuplicate(false);
          }}
          onUnlinked={() => {
            setLinked(false);
            setShowDuplicate(false);
          }}
        />
      )}
      {step === 5 && !showDuplicate && <StepReview linked={linked} />}
    </div>
  );
};

export default NewRoom;
