import { useQuery } from "@tanstack/react-query";
import { getStageScreens, type GetStageScreensResponse } from "@/services/api/lifecycle/get-stage-screens";

export const STAGE_SCREENS_QUERY_KEY = (stageKey: string) => ["lifecycle-stage-screens", stageKey];

export const useGetStageScreens = (stageKey: string) =>
  useQuery<GetStageScreensResponse, Error>({
    queryKey: STAGE_SCREENS_QUERY_KEY(stageKey),
    queryFn: () => getStageScreens(stageKey),
    enabled: !!stageKey,
  });
