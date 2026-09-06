import { useQuery } from "@tanstack/react-query";
import { getStageDefinition, type GetStageDefinitionResponse } from "@/services/api/lifecycle/get-stage-definition";

export const STAGE_DEFINITION_QUERY_KEY = (stageKey: string) => ["lifecycle-stage-definition", stageKey];

export const useGetStageDefinition = (stageKey: string) =>
  useQuery<GetStageDefinitionResponse, Error>({
    queryKey: STAGE_DEFINITION_QUERY_KEY(stageKey),
    queryFn: () => getStageDefinition(stageKey),
    enabled: !!stageKey,
  });
