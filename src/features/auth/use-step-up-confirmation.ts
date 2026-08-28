import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  requestStepUpCode,
  type RequestStepUpCodeResponse,
} from "@/services/api/auth/request-step-up-code";
import {
  verifyStepUpCode,
  type VerifyStepUpCodeResponse,
} from "@/services/api/auth/verify-step-up-code";
import type { StepUpAction } from "@/validators/auth";

// Exact phrase the backend returns in `messages[0]` when a *conditionally* gated mutation
// (e.g. change_administrators) is attempted with no stepUpChallengeId — per
// auth-frontend-handoff.md's suggested UX: "attempt without a challenge id first. If the
// reply is [this], request a step-up code and retry with the id attached." Actions that are
// *always* gated (change_workspace_markets, change_revenue_model) don't need this — they
// call useStepUpConfirmation up front instead of attempting bare first.
const STEP_UP_REQUIRED_MESSAGE = "Confirm this change with the code we emailed you.";

export const isStepUpRequiredMessage = (message?: string): boolean => message === STEP_UP_REQUIRED_MESSAGE;

interface UseStepUpConfirmationOptions {
  action: StepUpAction;
  /** Fires once the emailed code is verified — attach this challengeId to the real mutation. */
  onConfirmed: (challengeId: string) => void;
}

/**
 * Generic step-up flow per the auth handoff doc: request an emailed code for one
 * action, verify it, hand the caller a `challengeId` to attach to the gated mutation.
 * Verified challenges are single-use and expire in 2 minutes — request fresh right
 * before the modal opens, don't cache one across sessions.
 */
const useStepUpConfirmation = ({ action, onConfirmed }: UseStepUpConfirmationOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const requestMutation = useMutation<RequestStepUpCodeResponse, Error, void>({
    mutationFn: () => requestStepUpCode({ action }),
    onSuccess: (data) => {
      setChallengeId(data.data);
      setIsOpen(true);
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't send the confirmation code. Please try again.");
    },
  });

  const verifyMutation = useMutation<VerifyStepUpCodeResponse, Error, string>({
    mutationFn: (code) => {
      if (!challengeId) throw new Error("Missing challenge id — request a code first.");
      return verifyStepUpCode({ challengeId, code });
    },
    onSuccess: () => {
      if (!challengeId) return;
      setIsOpen(false);
      onConfirmed(challengeId);
    },
    onError: (error) => {
      toast.error(error.message || "That code is not valid. Request a new one and try again.");
    },
  });

  return {
    isOpen,
    begin: () => requestMutation.mutate(),
    resend: () => requestMutation.mutate(),
    verify: (code: string) => verifyMutation.mutate(code),
    close: () => setIsOpen(false),
    isRequesting: requestMutation.isPending,
    isVerifying: verifyMutation.isPending,
  };
};

export default useStepUpConfirmation;
