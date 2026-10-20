import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveRelationship,
  type ApproveRelationshipPayload,
  type ApproveRelationshipResponse,
} from "@/services/api/datasource-relationships/approve-relationship";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";
import { RELATIONSHIPS_QUERY_KEY } from "./use-get-relationships";

interface ApproveRelationshipVariables {
  id: string;
  payload: ApproveRelationshipPayload;
}

interface UseApproveRelationshipOptions {
  onSuccess?: (mapping: RelationshipMapping) => void;
}

// No optimistic update and no automatic retry: on a 409 the receipt is no longer valid, so the
// caller reloads and requests a fresh preview instead of replaying the approval.
const useApproveRelationship = (options?: UseApproveRelationshipOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ApproveRelationshipResponse,
    RelationshipApiError,
    ApproveRelationshipVariables
  >({
    mutationFn: ({ id, payload }) => approveRelationship(id, payload),
    retry: false,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Relationship approved");
        queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY });
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to approve relationship");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve relationship");
    },
  });

  return {
    approveRelationship: mutation.mutate,
    approveRelationshipAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useApproveRelationship;
