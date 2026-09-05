import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateStageOwner,
  type UpdateStageOwnerPayload,
  type UpdateStageOwnerResponse,
} from "@/services/api/lifecycle/update-stage-owner";
import { LIFECYCLE_MAP_QUERY_KEY } from "@/features/lifecycle/use-get-lifecycle-map";

interface UseUpdateStageOwnerOptions {
  onSuccess?: () => void;
}

const useUpdateStageOwner = (options?: UseUpdateStageOwnerOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateStageOwnerResponse, Error, UpdateStageOwnerPayload>({
    mutationFn: updateStageOwner,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to assign the stage owner");
        return;
      }

      toast.success("Stage owner assigned");
      queryClient.invalidateQueries({ queryKey: LIFECYCLE_MAP_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign the stage owner");
    },
  });

  return {
    assignOwner: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateStageOwner;
