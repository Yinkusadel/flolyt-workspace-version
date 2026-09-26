import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { steerAgentRun, type SteerAgentRunParams } from "@/services/api/agent-runs/steer-agent-run";
import { AGENT_RUN_QUERY_KEY } from "./use-get-agent-run";

export const useSteerAgentRun = () => {
  const queryClient = useQueryClient();

  const steer = useMutation({
    mutationFn: (params: SteerAgentRunParams) => {
      console.log("📝 Steer run requested:", params);
      return steerAgentRun(params);
    },
    onSuccess: (data, { runId }) => {
      console.log("📝 Steer run response:", { runId, data });
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to send the steering note");
        return;
      }
      toast.success("Note added for the next step");
      queryClient.invalidateQueries({ queryKey: AGENT_RUN_QUERY_KEY(runId) });
    },
    onError: (error: Error, { runId }) => {
      console.error("❌ Steer run failed:", { runId, error });
      toast.error(error.message || "Failed to send the steering note");
    },
  });

  return { steerRun: steer.mutate, isSteering: steer.isPending };
};
