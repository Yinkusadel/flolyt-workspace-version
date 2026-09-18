import { useQuery } from "@tanstack/react-query";
import {
  getWorkspaceAgents,
  type GetWorkspaceAgentsResponse,
  type WorkspaceAgentsDto,
} from "@/services/api/workspace/get-workspace-agents";

export const WORKSPACE_AGENTS_QUERY_KEY = ["workspace-agents"];

// Advocacy and Release Impact are always "not_ready" on every workspace — don't
// render a "connect to unlock" CTA for those two, nothing fixes them.
const useGetWorkspaceAgents = () => {
  const query = useQuery<GetWorkspaceAgentsResponse, Error>({
    queryKey: WORKSPACE_AGENTS_QUERY_KEY,
    queryFn: getWorkspaceAgents,
  });

  return {
    ...query,
    agents: query.data?.data ?? (null as WorkspaceAgentsDto | null),
  };
};

export default useGetWorkspaceAgents;
