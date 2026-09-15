import { useQuery } from "@tanstack/react-query";
import {
  getWorkspaceMembers,
  type GetWorkspaceMembersResponse,
  type WorkspaceMemberDto,
} from "@/services/api/workspace/get-workspace-members";

export const WORKSPACE_MEMBERS_QUERY_KEY = ["workspace-members"];

// Deactivated members are included, flagged isActive: false — don't filter them
// out here, historical attributions still need them to resolve.
const useGetWorkspaceMembers = () => {
  const query = useQuery<GetWorkspaceMembersResponse, Error>({
    queryKey: WORKSPACE_MEMBERS_QUERY_KEY,
    queryFn: getWorkspaceMembers,
  });

  return {
    ...query,
    members: query.data?.data ?? ([] as WorkspaceMemberDto[]),
  };
};

export default useGetWorkspaceMembers;
