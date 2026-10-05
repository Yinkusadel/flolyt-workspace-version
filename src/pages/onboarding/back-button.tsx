import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  /** Previous step's route. */
  to: string;
  disabled?: boolean;
}

/**
 * Sits left of every wizard step's Continue button — see docs/onboarding/build-plan.md's primary
 * CTA convention. Not used on /onboarding/start: it's the flow's entry point right after sign-in,
 * so there's no prior step (and no history entry) for a back button to lead to.
 */
export function BackButton({ to, disabled }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => navigate(to)}
      disabled={disabled}
      className="h-10.5 shrink-0 rounded-card px-5 text-[13px] font-semibold"
    >
      Back
    </Button>
  );
}
