import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createStageCondition,
  type CreateStageConditionPayload,
  type CreateStageConditionResponse,
} from "@/services/api/lifecycle/create-stage-condition";
import { STAGE_AGENTS_QUERY_KEY } from "@/features/lifecycle/use-get-stage-agents";

interface UseCreateStageConditionOptions {
  onSuccess?: (conditionId: string) => void;
}

const useCreateStageCondition = (options?: UseCreateStageConditionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateStageConditionResponse, Error, CreateStageConditionPayload>({
    mutationFn: createStageCondition,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to create the condition");
        return;
      }

      toast.success("Condition created");
      queryClient.invalidateQueries({ queryKey: STAGE_AGENTS_QUERY_KEY(variables.stageKey) });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create the condition");
    },
  });

  return {
    createCondition: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateStageCondition;
