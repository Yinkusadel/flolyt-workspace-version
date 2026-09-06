import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateStageDefinition,
  type UpdateStageDefinitionPayload,
  type UpdateStageDefinitionResponse,
} from "@/services/api/lifecycle/update-stage-definition";
import { LIFECYCLE_MAP_QUERY_KEY } from "@/features/lifecycle/use-get-lifecycle-map";

interface UseUpdateStageDefinitionOptions {
  onSuccess?: (result: UpdateStageDefinitionResponse["data"]) => void;
  /** Surfaced separately since a 409 (previewToken stale/mismatched) means "re-run the preview," not a generic failure. */
  onTokenMismatch?: () => void;
}

const useUpdateStageDefinition = (options?: UseUpdateStageDefinitionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateStageDefinitionResponse, Error, UpdateStageDefinitionPayload>({
    mutationFn: updateStageDefinition,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to save the stage definition");
        return;
      }

      toast.success("Stage definition saved");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-definition"] });
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage"] });
      queryClient.invalidateQueries({ queryKey: LIFECYCLE_MAP_QUERY_KEY });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      if (error.message === "STAGE_DEFINITION_TOKEN_MISMATCH" && options?.onTokenMismatch) {
        options.onTokenMismatch();
        return;
      }

      toast.error(error.message || "Failed to save the stage definition");
    },
  });

  return {
    saveDefinition: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateStageDefinition;
