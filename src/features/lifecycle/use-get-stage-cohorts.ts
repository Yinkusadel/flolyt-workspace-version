import { useQuery } from "@tanstack/react-query";
import {
  getStageCohorts,
  type GetStageCohortsParams,
  type GetStageCohortsResponse,
} from "@/services/api/lifecycle/get-stage-cohorts";

export const STAGE_COHORTS_QUERY_KEY = (stageKey: string, params?: GetStageCohortsParams) => [
  "lifecycle-stage-cohorts",
  stageKey,
  params,
];

export const useGetStageCohorts = (stageKey: string, params?: GetStageCohortsParams) =>
  useQuery<GetStageCohortsResponse, Error>({
    queryKey: STAGE_COHORTS_QUERY_KEY(stageKey, params),
    queryFn: () => getStageCohorts(stageKey, params),
    enabled: !!stageKey,
  });
