import { useQuery } from "@tanstack/react-query";
import {
  getStageChangeRegistry,
  type GetStageChangeRegistryResponse,
} from "@/services/api/lifecycle/get-stage-change-registry";

export const STAGE_CHANGE_REGISTRY_QUERY_KEY = (stageKey: string) => ["lifecycle-stage-change-registry", stageKey];

export const useGetStageChangeRegistry = (stageKey: string) =>
  useQuery<GetStageChangeRegistryResponse, Error>({
    queryKey: STAGE_CHANGE_REGISTRY_QUERY_KEY(stageKey),
    queryFn: () => getStageChangeRegistry(stageKey),
    enabled: !!stageKey,
  });
