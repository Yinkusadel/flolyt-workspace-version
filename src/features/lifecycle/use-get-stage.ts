import { useQuery } from "@tanstack/react-query";
import { getStage, type GetStageResponse } from "@/services/api/lifecycle/get-stage";

export const STAGE_QUERY_KEY = (stageKey: string) => ["lifecycle-stage", stageKey];

export const useGetStage = (stageKey: string) =>
  useQuery<GetStageResponse, Error>({
    queryKey: STAGE_QUERY_KEY(stageKey),
    queryFn: () => getStage(stageKey),
    enabled: !!stageKey,
  });
