import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRelationship,
  type CreateRelationshipPayload,
  type CreateRelationshipResponse,
} from "@/services/api/datasource-relationships/create-relationship";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";
import { RELATIONSHIPS_QUERY_KEY } from "./use-get-relationships";

interface UseCreateRelationshipOptions {
  onSuccess?: (mapping: RelationshipMapping) => void;
}

// No useForm here: the declare form is not built yet, and its schema needs the catalog.
const useCreateRelationship = (options?: UseCreateRelationshipOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateRelationshipResponse,
    RelationshipApiError,
    CreateRelationshipPayload
  >({
    mutationFn: createRelationship,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Draft saved");
        queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY });
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to create relationship");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create relationship");
    },
  });

  return {
    createRelationship: mutation.mutate,
    createRelationshipAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useCreateRelationship;
