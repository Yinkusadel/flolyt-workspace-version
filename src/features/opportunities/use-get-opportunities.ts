import { useQuery } from "@tanstack/react-query";
import { getOpportunities, type GetOpportunitiesResponse } from "@/services/api/opportunities/get-opportunities";

export const OPPORTUNITIES_QUERY_KEY = ["opportunities"];

/**
 * `retry: false` + no error surfaced to the page's primary error banner — this is a secondary,
 * independently-flagged panel (see get-opportunities.ts), not core to the leakage page. A
 * workspace without `OpportunityV1:ReadRollout` enabled should just not show the panel, not block
 * or scare the user with an error the rest of the page doesn't have.
 */
export const useGetOpportunities = (enabled: boolean) =>
  useQuery<GetOpportunitiesResponse, Error>({
    queryKey: OPPORTUNITIES_QUERY_KEY,
    queryFn: () => getOpportunities(),
    enabled,
    retry: false,
  });
