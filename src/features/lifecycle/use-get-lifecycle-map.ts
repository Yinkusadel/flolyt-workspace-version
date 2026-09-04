import { useQuery } from "@tanstack/react-query";
import {
  getLifecycleMap,
  type GetLifecycleMapResponse,
  type LifecycleCalloutDto,
  type LifecycleMarketLensDto,
  type LifecycleReferralReachDto,
  type LifecycleStageDto,
} from "@/services/api/lifecycle/get-lifecycle-map";

export const LIFECYCLE_MAP_QUERY_KEY = ["lifecycle-map"];

const useGetLifecycleMap = () => {
  const query = useQuery<GetLifecycleMapResponse, Error>({
    queryKey: LIFECYCLE_MAP_QUERY_KEY,
    queryFn: getLifecycleMap,
  });

  return {
    ...query,
    stages: query.data?.data.stages ?? ([] as LifecycleStageDto[]),
    callouts: query.data?.data.callouts ?? ([] as LifecycleCalloutDto[]),
    marketLens: query.data?.data.marketLens ?? (null as LifecycleMarketLensDto | null),
    referralReach: query.data?.data.referralReach ?? (null as LifecycleReferralReachDto | null),
  };
};

export default useGetLifecycleMap;
