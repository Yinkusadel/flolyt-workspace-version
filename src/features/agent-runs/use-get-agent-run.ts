import { useQuery } from "@tanstack/react-query";
import { getAgentRun, type GetAgentRunResponse } from "@/services/api/agent-runs/get-agent-run";

export const AGENT_RUN_QUERY_KEY = (runId: string | null | undefined) => ["agent-run", runId];

export const useGetAgentRun = (
  runId: string | null | undefined,
  options?: { enabled?: boolean }
) =>
  useQuery<GetAgentRunResponse, Error>({
    queryKey: AGENT_RUN_QUERY_KEY(runId),
    queryFn: () => getAgentRun(runId as string),
    enabled: (options?.enabled ?? true) && !!runId,
  });
