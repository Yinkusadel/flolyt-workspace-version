import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  acknowledgeChurnRouting,
  type AcknowledgeChurnRoutingPayload,
  type AcknowledgeChurnRoutingResponse,
} from "@/services/api/lifecycle/acknowledge-churn-routing";
import { CHURN_ROUTINGS_QUERY_KEY } from "@/features/lifecycle/use-get-churn-routings";

interface UseAcknowledgeChurnRoutingOptions {
  onSuccess?: () => void;
}

const useAcknowledgeChurnRouting = (options?: UseAcknowledgeChurnRoutingOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AcknowledgeChurnRoutingResponse, Error, AcknowledgeChurnRoutingPayload>({
    mutationFn: acknowledgeChurnRouting,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to acknowledge the routing");
        return;
      }

      toast.success("Routing acknowledged");
      queryClient.invalidateQueries({ queryKey: CHURN_ROUTINGS_QUERY_KEY() });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to acknowledge the routing");
    },
  });

  return {
    acknowledge: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useAcknowledgeChurnRouting;
