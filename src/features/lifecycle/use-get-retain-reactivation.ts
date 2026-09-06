import { useQuery } from "@tanstack/react-query";
import {
  getRetainReactivation,
  type GetRetainReactivationResponse,
} from "@/services/api/lifecycle/get-retain-reactivation";

export const RETAIN_REACTIVATION_QUERY_KEY = ["lifecycle-retain-reactivation"];

export const useGetRetainReactivation = () =>
  useQuery<GetRetainReactivationResponse, Error>({
    queryKey: RETAIN_REACTIVATION_QUERY_KEY,
    queryFn: getRetainReactivation,
  });
