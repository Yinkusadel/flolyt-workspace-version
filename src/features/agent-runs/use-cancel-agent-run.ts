import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAgentRun } from "@/services/api/agent-runs/cancel-agent-run";
import { AGENT_RUN_QUERY_KEY } from "./use-get-agent-run";

export const useCancelAgentRun = () => {
  const queryClient = useQueryClient();

  const cancel = useMutation({
    mutationFn: (runId: string) => {
      console.log("🛑 Cancel run requested:", runId);
      return cancelAgentRun(runId);
    },
    onSuccess: (data, runId) => {
      console.log("🛑 Cancel run response:", { runId, data });
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to cancel the run");
        return;
      }
      queryClient.invalidateQueries({ queryKey: AGENT_RUN_QUERY_KEY(runId) });
    },
    onError: (error: Error, runId) => {
      console.error("❌ Cancel run failed:", { runId, error });
      toast.error(error.message || "Failed to cancel the run");
    },
  });

  return { cancelRun: cancel.mutate, isCancelling: cancel.isPending };
};
