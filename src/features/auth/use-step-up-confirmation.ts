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
