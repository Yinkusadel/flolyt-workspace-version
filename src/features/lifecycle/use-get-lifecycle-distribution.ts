import { useQuery } from "@tanstack/react-query";
import {
  getLifecycleDistribution,
  type GetLifecycleDistributionResponse,
} from "@/services/api/lifecycle/get-lifecycle-distribution";

export const LIFECYCLE_DISTRIBUTION_QUERY_KEY = ["lifecycle-distribution"];

export const useGetLifecycleDistribution = () =>
  useQuery<GetLifecycleDistributionResponse, Error>({
    queryKey: LIFECYCLE_DISTRIBUTION_QUERY_KEY,
    queryFn: getLifecycleDistribution,
  });
