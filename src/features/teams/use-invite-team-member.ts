import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { inviteTeamMemberSchema, type InviteTeamMemberSchemaType } from "@/validators/teams";
import {
  inviteTeamMember,
  type InviteTeamMemberResponse,
} from "@/services/api/teams/invite-team-member";
import { isStepUpRequiredMessage } from "@/features/auth/use-step-up-confirmation";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";
import { TEAM_INVITATIONS_QUERY_KEY } from "./use-get-team-invitations";

interface UseInviteTeamMemberOptions {
  defaultValues?: Partial<InviteTeamMemberSchemaType>;
  onSuccess?: () => void;
  /**
   * Fires instead of the generic error toast when the backend rejects a bare (no
   * stepUpChallengeId) attempt because Administrator was granted — `change_administrators`
   * is conditionally step-up gated per auth-frontend-handoff.md. The caller should request a
   * step-up code, then resubmit the same form with `stepUpChallengeId` set.
   */
  onStepUpRequired?: () => void;
}

const useInviteTeamMember = (teamId: string, options?: UseInviteTeamMemberOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<InviteTeamMemberSchemaType>({
    resolver: zodResolver(inviteTeamMemberSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      roles: [],
      functionalRoles: null,
      stepUpChallengeId: null,
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<InviteTeamMemberResponse, Error, InviteTeamMemberSchemaType>({
    mutationFn: (payload) =>
      inviteTeamMember(teamId, {
        ...payload,
        functionalRoles: payload.functionalRoles ?? null,
        stepUpChallengeId: payload.stepUpChallengeId ?? null,
      }),
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Invitation sent");
        queryClient.invalidateQueries({ queryKey: TEAM_INVITATIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
        form.reset();
        options?.onSuccess?.();
        return;
      }

      if (isStepUpRequiredMessage(data.messages?.[0]) && options?.onStepUpRequired) {
        options.onStepUpRequired();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to send invitation");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation");
    },
  });

  const onSubmit = (values: InviteTeamMemberSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useInviteTeamMember;
