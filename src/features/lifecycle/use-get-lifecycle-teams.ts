import { useQuery } from "@tanstack/react-query";
import { getLifecycleTeams, type GetLifecycleTeamsResponse } from "@/services/api/lifecycle/get-lifecycle-teams";

export const LIFECYCLE_TEAMS_QUERY_KEY = ["lifecycle-teams"];

export const useGetLifecycleTeams = () =>
  useQuery<GetLifecycleTeamsResponse, Error>({
    queryKey: LIFECYCLE_TEAMS_QUERY_KEY,
    queryFn: getLifecycleTeams,
  });
