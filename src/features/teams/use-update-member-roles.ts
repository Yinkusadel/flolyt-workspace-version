import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMemberRolesSchema, type UpdateMemberRolesSchemaType } from "@/validators/teams";
import {
  updateMemberRoles,
  type UpdateMemberRolesResponse,
} from "@/services/api/teams/update-member-roles";
import { isStepUpRequiredMessage } from "@/features/auth/use-step-up-confirmation";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";

interface UseUpdateMemberRolesOptions {
  defaultValues?: Partial<UpdateMemberRolesSchemaType>;
  onSuccess?: () => void;
  /** Mirrors useInviteTeamMember's onStepUpRequired — granting Administrator is conditionally step-up gated. */
  onStepUpRequired?: () => void;
}

// stepUpChallengeId must come from a completed step-up challenge — see the note
// in services/api/teams/update-member-roles.ts.
const useUpdateMemberRoles = (memberId: string, options?: UseUpdateMemberRolesOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateMemberRolesSchemaType>({
    resolver: zodResolver(updateMemberRolesSchema),
    mode: "onChange",
    defaultValues: { roles: [], stepUpChallengeId: null, ...options?.defaultValues },
  });

  const mutation = useMutation<UpdateMemberRolesResponse, Error, UpdateMemberRolesSchemaType>({
    mutationFn: (payload) =>
      updateMemberRoles(memberId, {
        ...payload,
        stepUpChallengeId: payload.stepUpChallengeId ?? null,
      }),
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Roles updated");
        queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      if (isStepUpRequiredMessage(data.messages?.[0]) && options?.onStepUpRequired) {
        options.onStepUpRequired();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update roles");
    },
    onError: (error) => {
      if (isStepUpRequiredMessage(error.message) && options?.onStepUpRequired) {
        options.onStepUpRequired();
        return;
      }

      toast.error(error.message || "Failed to update roles");
    },
  });

  const onSubmit = (values: UpdateMemberRolesSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateMemberRoles;
