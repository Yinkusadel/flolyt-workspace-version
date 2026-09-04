import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  decideCondition,
  type DecideConditionPayload,
  type DecideConditionResponse,
} from "@/services/api/lifecycle/decide-condition";

interface UseDecideConditionOptions {
  onSuccess?: () => void;
}

const useDecideCondition = (options?: UseDecideConditionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DecideConditionResponse, Error, DecideConditionPayload>({
    mutationFn: decideCondition,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to decide the condition");
        return;
      }

      toast.success(variables.accept ? "Condition accepted" : "Condition declined");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-agents"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to decide the condition");
    },
  });

  return {
    decideCondition: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDecideCondition;
