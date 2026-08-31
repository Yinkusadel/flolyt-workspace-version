import { useQuery } from "@tanstack/react-query";
import {
  getOnboardingStatus,
  type GetOnboardingStatusResponse,
  type OnboardingStatusDto,
} from "@/services/api/workspace/get-onboarding-status";

export const ONBOARDING_STATUS_QUERY_KEY = ["workspace-onboarding-status"];

interface UseGetOnboardingStatusOptions {
  /** This endpoint resolves "which workspace" from the session — don't call it before one exists. */
  enabled?: boolean;
}

// finished:true does not mean nothing's outstanding — always check .steps, don't
// short-circuit the checklist UI on the finished flag alone.
const useGetOnboardingStatus = (options?: UseGetOnboardingStatusOptions) => {
  const query = useQuery<GetOnboardingStatusResponse, Error>({
    queryKey: ONBOARDING_STATUS_QUERY_KEY,
    queryFn: getOnboardingStatus,
    enabled: options?.enabled ?? true,
    // This gates every protected page load (see protected-route.tsx) — override
    // the app-wide retry:5 default so a broken backend response fails fast
    // instead of stacking 5 retries on every single navigation.
    retry: 1,
  });

  return {
    ...query,
    onboarding: query.data?.data ?? (null as OnboardingStatusDto | null),
  };
};

export default useGetOnboardingStatus;
