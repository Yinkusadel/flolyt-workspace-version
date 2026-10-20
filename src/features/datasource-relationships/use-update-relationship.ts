import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateRelationship,
  type UpdateRelationshipPayload,
  type UpdateRelationshipResponse,
} from "@/services/api/datasource-relationships/update-relationship";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";
import { refreshRelationships } from "./refresh-relationships";

interface UpdateRelationshipVariables {
  id: string;
  payload: UpdateRelationshipPayload;
}

interface UseUpdateRelationshipOptions {
  onSuccess?: (mapping: RelationshipMapping) => void;
}

// A revision clears approval and returns the mapping to DRAFT (a disabled one stays disabled), so
// callers must preview and approve again. On a 409 the error carries `status === 409`: keep the
// editor, reload, and request another preview.
const useUpdateRelationship = (options?: UseUpdateRelationshipOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateRelationshipResponse,
    RelationshipApiError,
    UpdateRelationshipVariables
  >({
    mutationFn: ({ id, payload }) => updateRelationship(id, payload),
    onSuccess: async (data) => {
      if (data.succeeded) {
        toast.success("Relationship updated");
        await refreshRelationships(queryClient, data.data);
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update relationship");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update relationship");
    },
  });

  return {
    updateRelationship: mutation.mutate,
    updateRelationshipAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useUpdateRelationship;
