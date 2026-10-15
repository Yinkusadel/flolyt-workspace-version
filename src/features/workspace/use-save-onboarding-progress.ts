import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  saveOnboardingProgress,
  type SaveOnboardingProgressPayload,
  type SaveOnboardingProgressResponse,
} from "@/services/api/workspace/save-onboarding-progress";
import { ONBOARDING_STATUS_QUERY_KEY } from "./use-get-onboarding-status";

// Silent by design — this fires on step views, not user-initiated submits, so no
// success/error toast. Only call with ViewedStep/ReviewedMapping/AcknowledgedAgents/
// Finished — everything else derivable from real state must never be posted here.
const useSaveOnboardingProgress = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SaveOnboardingProgressResponse,
    Error,
    SaveOnboardingProgressPayload
  >({
    mutationFn: saveOnboardingProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_QUERY_KEY });
    },
  });

  return {
    saveProgress: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSaveOnboardingProgress;
