import { useQuery } from "@tanstack/react-query";
import {
  getInvitationDetails,
  type GetInvitationDetailsResponse,
  type InvitationDetailsDto,
} from "@/services/api/teams/get-invitation-details";

export const INVITATION_DETAILS_QUERY_KEY = ["invitation-details"];

const useGetInvitationDetails = (token: string) => {
  const query = useQuery<GetInvitationDetailsResponse, Error>({
    queryKey: [...INVITATION_DETAILS_QUERY_KEY, token],
    queryFn: () => getInvitationDetails(token),
    enabled: !!token,
  });

  return {
    ...query,
    invitation: query.data?.data ?? (null as InvitationDetailsDto | null),
  };
};

export default useGetInvitationDetails;
