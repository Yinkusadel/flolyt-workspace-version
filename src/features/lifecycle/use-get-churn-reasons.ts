import { useQuery } from "@tanstack/react-query";
import { getChurnReasons, type GetChurnReasonsResponse } from "@/services/api/lifecycle/get-churn-reasons";

export const CHURN_REASONS_QUERY_KEY = ["lifecycle-churn-reasons"];

export const useGetChurnReasons = () =>
  useQuery<GetChurnReasonsResponse, Error>({
    queryKey: CHURN_REASONS_QUERY_KEY,
    queryFn: getChurnReasons,
  });
