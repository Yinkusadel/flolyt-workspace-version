import { useQuery } from "@tanstack/react-query";
import {
  getStageCompare,
  type GetStageCompareParams,
  type GetStageCompareResponse,
} from "@/services/api/lifecycle/get-stage-compare";

export const STAGE_COMPARE_QUERY_KEY = (stageKey: string, params?: GetStageCompareParams) => [
  "lifecycle-stage-compare",
  stageKey,
  params,
];

export const useGetStageCompare = (stageKey: string, params?: GetStageCompareParams) =>
  useQuery<GetStageCompareResponse, Error>({
    queryKey: STAGE_COMPARE_QUERY_KEY(stageKey, params),
    queryFn: () => getStageCompare(stageKey, params),
    enabled: !!stageKey,
  });
