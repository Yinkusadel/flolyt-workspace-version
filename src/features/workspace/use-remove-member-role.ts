import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  removeMemberRole,
  type RemoveMemberRolePayload,
  type RemoveMemberRoleResponse,
} from "@/services/api/workspace/remove-member-role";
import { WORKSPACE_MEMBERS_QUERY_KEY } from "./use-get-workspace-members";
import { MY_ROLES_QUERY_KEY } from "./use-get-my-roles";
import { MEMBER_ROLES_QUERY_KEY } from "./use-get-member-roles";

interface UseRemoveMemberRoleOptions {
  onSuccess?: () => void;
}

// Admin-only. Single role per call — not the array-based assign-member-roles shape.
const useRemoveMemberRole = (options?: UseRemoveMemberRoleOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RemoveMemberRoleResponse, Error, RemoveMemberRolePayload>({
    mutationFn: removeMemberRole,
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Role removed");
        queryClient.invalidateQueries({ queryKey: WORKSPACE_MEMBERS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: MY_ROLES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: MEMBER_ROLES_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to remove role");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove role");
    },
  });

  return {
    removeRole: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRemoveMemberRole;
