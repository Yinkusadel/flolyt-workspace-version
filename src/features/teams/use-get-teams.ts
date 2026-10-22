import { useQuery } from "@tanstack/react-query";
import {
  getTeams,
  type GetTeamsParams,
  type GetTeamsResponse,
  type TeamDto,
} from "@/services/api/teams/get-teams";

export const TEAMS_QUERY_KEY = ["teams"];

const useGetTeams = (params?: GetTeamsParams) => {
  const query = useQuery<GetTeamsResponse, Error>({
    queryKey: [...TEAMS_QUERY_KEY, params],
    queryFn: () => getTeams(params),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    teams: query.data?.data ?? ([] as TeamDto[]),
    totalCount: query.data?.totalCount ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    hasNextPage: query.data?.hasNextPage ?? false,
    hasPreviousPage: query.data?.hasPreviousPage ?? false,
  };
};

export default useGetTeams;
