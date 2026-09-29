import { useQuery } from "@tanstack/react-query";
import { getLeakage, type GetLeakageParams, type GetLeakageResponse } from "@/services/api/leakage/get-leakage";

export const LEAKAGE_QUERY_KEY = (params?: GetLeakageParams) => ["leakage", params];

export const useGetLeakage = (params?: GetLeakageParams) =>
  useQuery<GetLeakageResponse, Error>({
    queryKey: LEAKAGE_QUERY_KEY(params),
    queryFn: () => getLeakage(params),
    // Keeps the previous filter's figures on screen (greyed by the loading banner) while a new
    // one refetches, instead of flashing back to a full skeleton on every filter change — matches
    // PAGE_STATES.loading's own "previous figures stay visible" copy.
    placeholderData: (previousData) => previousData,
  });
