import { useQuery } from "@tanstack/react-query";
import {
  getTeamById,
  type GetTeamByIdResponse,
  type TeamDetailDto,
} from "@/services/api/teams/get-team-by-id";

export const TEAM_DETAIL_QUERY_KEY = ["team-detail"];

const useGetTeamById = (teamId: string) => {
  const query = useQuery<GetTeamByIdResponse, Error>({
    queryKey: [...TEAM_DETAIL_QUERY_KEY, teamId],
    queryFn: () => getTeamById(teamId),
    enabled: !!teamId,
  });

  return {
    ...query,
    team: query.data?.data ?? (null as TeamDetailDto | null),
  };
};

export default useGetTeamById;
