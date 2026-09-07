import { useQuery } from "@tanstack/react-query";
import {
  getChurnRoutings,
  type GetChurnRoutingsParams,
  type GetChurnRoutingsResponse,
} from "@/services/api/lifecycle/get-churn-routings";

export const CHURN_ROUTINGS_QUERY_KEY = (params?: GetChurnRoutingsParams) => ["lifecycle-churn-routings", params];

export const useGetChurnRoutings = (params?: GetChurnRoutingsParams) =>
  useQuery<GetChurnRoutingsResponse, Error>({
    queryKey: CHURN_ROUTINGS_QUERY_KEY(params),
    queryFn: () => getChurnRoutings(params),
  });
