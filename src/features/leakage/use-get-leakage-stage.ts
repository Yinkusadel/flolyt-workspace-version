import { useQuery } from "@tanstack/react-query";
import {
  getLeakageStage,
  type GetLeakageStageParams,
  type GetLeakageStageResponse,
} from "@/services/api/leakage/get-leakage-stage";

export const LEAKAGE_STAGE_QUERY_KEY = (stageKey: string, params?: GetLeakageStageParams) => [
  "leakage-stage",
  stageKey,
  params,
];

export const useGetLeakageStage = (stageKey: string, params?: GetLeakageStageParams) =>
  useQuery<GetLeakageStageResponse, Error>({
    queryKey: LEAKAGE_STAGE_QUERY_KEY(stageKey, params),
    queryFn: () => getLeakageStage(stageKey, params),
    enabled: !!stageKey,
  });
