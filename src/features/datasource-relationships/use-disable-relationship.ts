import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  disableRelationship,
  type DisableRelationshipPayload,
  type DisableRelationshipResponse,
} from "@/services/api/datasource-relationships/disable-relationship";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";
import { RELATIONSHIPS_QUERY_KEY } from "./use-get-relationships";

interface DisableRelationshipVariables {
  id: string;
  payload: DisableRelationshipPayload;
}

interface UseDisableRelationshipOptions {
  onSuccess?: (mapping: RelationshipMapping) => void;
}

const useDisableRelationship = (options?: UseDisableRelationshipOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DisableRelationshipResponse,
    RelationshipApiError,
    DisableRelationshipVariables
  >({
    mutationFn: ({ id, payload }) => disableRelationship(id, payload),
    retry: false,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Relationship disabled");
        queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY });
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to disable relationship");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disable relationship");
    },
  });

  return {
    disableRelationship: mutation.mutate,
    disableRelationshipAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useDisableRelationship;
