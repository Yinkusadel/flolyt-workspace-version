import { useQuery } from "@tanstack/react-query";
import { getStageAgents, type GetStageAgentsResponse } from "@/services/api/lifecycle/get-stage-agents";

export const STAGE_AGENTS_QUERY_KEY = (stageKey: string) => ["lifecycle-stage-agents", stageKey];

export const useGetStageAgents = (stageKey: string) =>
  useQuery<GetStageAgentsResponse, Error>({
    queryKey: STAGE_AGENTS_QUERY_KEY(stageKey),
    queryFn: () => getStageAgents(stageKey),
    enabled: !!stageKey,
  });
