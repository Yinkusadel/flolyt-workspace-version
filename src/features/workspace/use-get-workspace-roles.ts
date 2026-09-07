import { useQuery } from "@tanstack/react-query";
import {
  getWorkspaceRoles,
  type GetWorkspaceRolesResponse,
} from "@/services/api/workspace/get-workspace-roles";
import type { FunctionalRoleDto } from "@/services/api/workspace/get-workspace-members";

export const WORKSPACE_ROLES_QUERY_KEY = ["workspace-roles"];

const useGetWorkspaceRoles = () => {
  const query = useQuery<GetWorkspaceRolesResponse, Error>({
    queryKey: WORKSPACE_ROLES_QUERY_KEY,
    queryFn: getWorkspaceRoles,
  });

  return {
    ...query,
    roles: query.data?.data ?? ([] as FunctionalRoleDto[]),
  };
};

export default useGetWorkspaceRoles;
