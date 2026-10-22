import { useQuery } from "@tanstack/react-query";
import {
  getTeamInvitations,
  type GetTeamInvitationsParams,
  type GetTeamInvitationsResponse,
} from "@/services/api/teams/get-team-invitations";
import type { TeamInvitationDto } from "@/services/api/teams/get-team-by-id";

export const TEAM_INVITATIONS_QUERY_KEY = ["team-invitations"];

const useGetTeamInvitations = (teamId: string, params?: GetTeamInvitationsParams) => {
  const query = useQuery<GetTeamInvitationsResponse, Error>({
    queryKey: [...TEAM_INVITATIONS_QUERY_KEY, teamId, params],
    queryFn: () => getTeamInvitations(teamId, params),
    enabled: !!teamId,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    invitations: query.data?.data ?? ([] as TeamInvitationDto[]),
    totalCount: query.data?.totalCount ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    hasNextPage: query.data?.hasNextPage ?? false,
    hasPreviousPage: query.data?.hasPreviousPage ?? false,
  };
};

export default useGetTeamInvitations;
