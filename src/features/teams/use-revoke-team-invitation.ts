import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  revokeTeamInvitation,
  type RevokeTeamInvitationResponse,
} from "@/services/api/teams/revoke-team-invitation";
import { TEAM_INVITATIONS_QUERY_KEY } from "./use-get-team-invitations";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";

interface UseRevokeTeamInvitationOptions {
  onSuccess?: () => void;
}

const useRevokeTeamInvitation = (options?: UseRevokeTeamInvitationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RevokeTeamInvitationResponse, Error, string>({
    mutationFn: revokeTeamInvitation,
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Invitation revoked");
        queryClient.invalidateQueries({ queryKey: TEAM_INVITATIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to revoke invitation");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revoke invitation");
    },
  });

  return {
    revokeInvitation: mutation.mutate,
    isPending: mutation.isPending,
    // The invitationId of the in-flight (or last-settled) call — lets a caller with several
    // invitations on screen tell which specific one `isPending` refers to, instead of
    // treating every row as busy while any one revoke is in flight.
    variables: mutation.variables,
  };
};

export default useRevokeTeamInvitation;
