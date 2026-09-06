import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateStageConversion,
  type UpdateStageConversionPayload,
  type UpdateStageConversionResponse,
} from "@/services/api/lifecycle/update-stage-conversion";
import { STAGE_QUERY_KEY } from "@/features/lifecycle/use-get-stage";

interface UseUpdateStageConversionOptions {
  onSuccess?: () => void;
}

const useUpdateStageConversion = (options?: UseUpdateStageConversionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateStageConversionResponse, Error, UpdateStageConversionPayload>({
    mutationFn: updateStageConversion,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the stage's conversion");
        return;
      }

      toast.success("Conversion updated");
      queryClient.invalidateQueries({ queryKey: STAGE_QUERY_KEY(variables.stageKey) });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the stage's conversion");
    },
  });

  return {
    updateConversion: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateStageConversion;
