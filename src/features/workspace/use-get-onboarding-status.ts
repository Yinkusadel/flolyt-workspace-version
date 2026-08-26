import { useQuery } from "@tanstack/react-query";
import {
  getOnboardingStatus,
  type GetOnboardingStatusResponse,
  type OnboardingStatusDto,
} from "@/services/api/workspace/get-onboarding-status";

export const ONBOARDING_STATUS_QUERY_KEY = ["workspace-onboarding-status"];

// finished:true does not mean nothing's outstanding — always check .steps, don't
// short-circuit the checklist UI on the finished flag alone.
const useGetOnboardingStatus = () => {
  const query = useQuery<GetOnboardingStatusResponse, Error>({
    queryKey: ONBOARDING_STATUS_QUERY_KEY,
    queryFn: getOnboardingStatus,
  });

  return {
    ...query,
    onboarding: query.data?.data ?? (null as OnboardingStatusDto | null),
  };
};

export default useGetOnboardingStatus;
