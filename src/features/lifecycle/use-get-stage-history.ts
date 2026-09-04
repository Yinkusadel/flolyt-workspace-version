import { useQuery } from "@tanstack/react-query";
import { getStageHistory, type GetStageHistoryResponse } from "@/services/api/lifecycle/get-stage-history";

export const STAGE_HISTORY_QUERY_KEY = (stageKey: string) => ["lifecycle-stage-history", stageKey];

export const useGetStageHistory = (stageKey: string) =>
  useQuery<GetStageHistoryResponse, Error>({
    queryKey: STAGE_HISTORY_QUERY_KEY(stageKey),
    queryFn: () => getStageHistory(stageKey),
    enabled: !!stageKey,
  });
