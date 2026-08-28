import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ResendTeamInvitationSchemaType } from "@/validators/teams";
import {
  resendTeamInvitation,
  type ResendTeamInvitationResponse,
} from "@/services/api/teams/resend-team-invitation";
import { TEAM_INVITATIONS_QUERY_KEY } from "./use-get-team-invitations";

interface UseResendTeamInvitationOptions {
  onSuccess?: () => void;
}

// No form here — resend re-sends an existing invitation's already-known
// email/roles, it doesn't collect new input from the user.
const useResendTeamInvitation = (teamId: string, options?: UseResendTeamInvitationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResendTeamInvitationResponse,
    Error,
    ResendTeamInvitationSchemaType
  >({
    mutationFn: (payload) =>
      resendTeamInvitation(teamId, {
        ...payload,
        functionalRoles: payload.functionalRoles ?? null,
        stepUpChallengeId: payload.stepUpChallengeId ?? null,
      }),
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Invitation resent");
        queryClient.invalidateQueries({ queryKey: TEAM_INVITATIONS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to resend invitation");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend invitation");
    },
  });

  return {
    resendInvitation: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useResendTeamInvitation;
