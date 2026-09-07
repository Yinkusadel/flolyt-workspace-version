import { useQuery } from "@tanstack/react-query";
import { getStageMarkets, type GetStageMarketsResponse } from "@/services/api/lifecycle/get-stage-markets";

export const STAGE_MARKETS_QUERY_KEY = (stageKey: string) => ["lifecycle-stage-markets", stageKey];

export const useGetStageMarkets = (stageKey: string) =>
  useQuery<GetStageMarketsResponse, Error>({
    queryKey: STAGE_MARKETS_QUERY_KEY(stageKey),
    queryFn: () => getStageMarkets(stageKey),
    enabled: !!stageKey,
  });
