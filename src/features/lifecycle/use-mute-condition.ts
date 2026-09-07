import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { muteCondition, type MuteConditionPayload, type MuteConditionResponse } from "@/services/api/lifecycle/mute-condition";

interface UseMuteConditionOptions {
  onSuccess?: () => void;
}

const useMuteCondition = (options?: UseMuteConditionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<MuteConditionResponse, Error, MuteConditionPayload>({
    mutationFn: muteCondition,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the condition's mute state");
        return;
      }

      toast.success(variables.muted ? "Condition muted" : "Condition unmuted");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-agents"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the condition's mute state");
    },
  });

  return {
    muteCondition: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMuteCondition;
