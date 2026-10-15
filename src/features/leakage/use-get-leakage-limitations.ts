import { useQuery } from "@tanstack/react-query";
import {
  getLeakageLimitations,
  type GetLeakageLimitationsParams,
  type GetLeakageLimitationsResponse,
} from "@/services/api/leakage/get-leakage-limitations";

export const LEAKAGE_LIMITATIONS_QUERY_KEY = (params?: GetLeakageLimitationsParams) => ["leakage-limitations", params];

/** Only enable once the user opens the diagnostics drawer; the page itself ships a bounded summary. */
export const useGetLeakageLimitations = (params?: GetLeakageLimitationsParams, enabled = true) =>
  useQuery<GetLeakageLimitationsResponse, Error>({
    queryKey: LEAKAGE_LIMITATIONS_QUERY_KEY(params),
    queryFn: () => getLeakageLimitations(params),
    enabled,
    // Keeps the current page of rows on screen while the next page / a new code filter loads.
    placeholderData: (previousData) => previousData,
  });
