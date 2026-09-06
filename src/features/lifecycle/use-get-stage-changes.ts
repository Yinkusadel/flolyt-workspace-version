import { useQuery } from "@tanstack/react-query";
import {
  getStageChanges,
  type GetStageChangesParams,
  type GetStageChangesResponse,
} from "@/services/api/lifecycle/get-stage-changes";

export const STAGE_CHANGES_QUERY_KEY = (stageKey: string, params?: GetStageChangesParams) => [
  "lifecycle-stage-changes",
  stageKey,
  params,
];

export const useGetStageChanges = (stageKey: string, params?: GetStageChangesParams) =>
  useQuery<GetStageChangesResponse, Error>({
    queryKey: STAGE_CHANGES_QUERY_KEY(stageKey, params),
    queryFn: () => getStageChanges(stageKey, params),
    enabled: !!stageKey,
  });
