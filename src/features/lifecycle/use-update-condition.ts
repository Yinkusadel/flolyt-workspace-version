import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateCondition,
  type UpdateConditionPayload,
  type UpdateConditionResponse,
} from "@/services/api/lifecycle/update-condition";

interface UseUpdateConditionOptions {
  onSuccess?: () => void;
}

const useUpdateCondition = (options?: UseUpdateConditionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateConditionResponse, Error, UpdateConditionPayload>({
    mutationFn: updateCondition,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the condition");
        return;
      }

      toast.success("Condition updated");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-agents"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the condition");
    },
  });

  return {
    updateCondition: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateCondition;
