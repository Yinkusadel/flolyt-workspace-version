import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { steerAgentRun } from "@/services/api/agent-runs/steer-agent-run";
import { AGENT_RUN_QUERY_KEY } from "./use-get-agent-run";

export const useSteerAgentRun = () => {
  const queryClient = useQueryClient();

  const steer = useMutation({
    mutationFn: steerAgentRun,
    onSuccess: (data, { runId }) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to send the steering note");
        return;
      }
      toast.success("Note added for the next step");
      queryClient.invalidateQueries({ queryKey: AGENT_RUN_QUERY_KEY(runId) });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send the steering note"),
  });

  return { steerRun: steer.mutate, isSteering: steer.isPending };
};
