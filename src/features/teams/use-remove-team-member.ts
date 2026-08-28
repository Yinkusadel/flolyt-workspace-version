import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  removeTeamMember,
  type RemoveTeamMemberParams,
  type RemoveTeamMemberResponse,
} from "@/services/api/teams/remove-team-member";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";

interface UseRemoveTeamMemberOptions {
  onSuccess?: () => void;
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

      toast.error(data.messages?.[0] || "Failed to remove member");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove member");
    },
  });

  return {
    removeMember: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRemoveTeamMember;
