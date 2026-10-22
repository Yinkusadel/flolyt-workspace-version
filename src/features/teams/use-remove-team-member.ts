import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  removeTeamMember,
  type RemoveTeamMemberParams,
  type RemoveTeamMemberResponse,
} from "@/services/api/teams/remove-team-member";
import { isStepUpRequiredMessage } from "@/features/auth/use-step-up-confirmation";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";

interface UseRemoveTeamMemberOptions {
  onSuccess?: () => void;
  /** Mirrors useInviteTeamMember's onStepUpRequired — removing an Administrator may be conditionally step-up gated. */
  onStepUpRequired?: () => void;
}

const useRemoveTeamMember = (options?: UseRemoveTeamMemberOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RemoveTeamMemberResponse, Error, RemoveTeamMemberParams>({
    mutationFn: removeTeamMember,
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Member removed");
        queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      if (isStepUpRequiredMessage(data.messages?.[0]) && options?.onStepUpRequired) {
        options.onStepUpRequired();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to remove member");
    },
    onError: (error) => {
      if (isStepUpRequiredMessage(error.message) && options?.onStepUpRequired) {
        options.onStepUpRequired();
        return;
      }

      toast.error(error.message || "Failed to remove member");
    },
  });

  return {
    removeMember: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRemoveTeamMember;
