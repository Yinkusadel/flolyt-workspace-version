import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAgentRun } from "@/services/api/agent-runs/cancel-agent-run";
import { AGENT_RUN_QUERY_KEY } from "./use-get-agent-run";

export const useCancelAgentRun = () => {
  const queryClient = useQueryClient();

  const cancel = useMutation({
    mutationFn: cancelAgentRun,
    onSuccess: (data, runId) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to cancel the run");
        return;
      }
      queryClient.invalidateQueries({ queryKey: AGENT_RUN_QUERY_KEY(runId) });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to cancel the run"),
  });

  return { cancelRun: cancel.mutate, isCancelling: cancel.isPending };
};
