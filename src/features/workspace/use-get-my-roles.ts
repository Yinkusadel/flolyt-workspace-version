import { useQuery } from "@tanstack/react-query";
import {
  getMyRoles,
  type GetMyRolesResponse,
  type MemberRolesDto,
} from "@/services/api/workspace/get-my-roles";

export const MY_ROLES_QUERY_KEY = ["workspace-my-roles"];

const useGetMyRoles = () => {
  const query = useQuery<GetMyRolesResponse, Error>({
    queryKey: MY_ROLES_QUERY_KEY,
    queryFn: getMyRoles,
  });

  return {
    ...query,
    myRoles: query.data?.data ?? (null as MemberRolesDto | null),
  };
};

export default useGetMyRoles;
