import { useQuery } from "@tanstack/react-query";
import {
  getProposedMarkets,
  type GetProposedMarketsResponse,
  type ProposedMarketsDto,
} from "@/services/api/workspace/get-proposed-markets";

export const PROPOSED_MARKETS_QUERY_KEY = ["workspace-proposed-markets"];

const useGetProposedMarkets = () => {
  const query = useQuery<GetProposedMarketsResponse, Error>({
    queryKey: PROPOSED_MARKETS_QUERY_KEY,
    queryFn: getProposedMarkets,
    // Override the app-wide retry:5 default — see use-get-onboarding-status.ts.
    retry: 1,
  });

  return {
    ...query,
    proposedMarkets: query.data?.data ?? (null as ProposedMarketsDto | null),
  };
};

export default useGetProposedMarkets;
