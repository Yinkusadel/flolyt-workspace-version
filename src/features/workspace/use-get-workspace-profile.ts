import { useQuery } from "@tanstack/react-query";
import {
  getWorkspaceProfile,
  type GetWorkspaceProfileResponse,
  type WorkspaceProfileDto,
} from "@/services/api/workspace/get-workspace-profile";

export const WORKSPACE_PROFILE_QUERY_KEY = ["workspace-profile"];

const useGetWorkspaceProfile = () => {
  const query = useQuery<GetWorkspaceProfileResponse, Error>({
    queryKey: WORKSPACE_PROFILE_QUERY_KEY,
    queryFn: getWorkspaceProfile,
  });

  return {
    ...query,
    profile: query.data?.data ?? (null as WorkspaceProfileDto | null),
  };
};

export default useGetWorkspaceProfile;
