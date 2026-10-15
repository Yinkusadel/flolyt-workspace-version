import { useQuery } from "@tanstack/react-query";
import {
  getLifecycleThresholds,
  type GetLifecycleThresholdsResponse,
  type LifecycleThresholdsDto,
} from "@/services/api/workspace/get-lifecycle-thresholds";

export const LIFECYCLE_THRESHOLDS_QUERY_KEY = ["workspace-lifecycle-thresholds"];

const useGetLifecycleThresholds = () => {
  const query = useQuery<GetLifecycleThresholdsResponse, Error>({
    queryKey: LIFECYCLE_THRESHOLDS_QUERY_KEY,
    queryFn: getLifecycleThresholds,
  });

  return {
    ...query,
    thresholds: query.data?.data ?? (null as LifecycleThresholdsDto | null),
  };
};

export default useGetLifecycleThresholds;
