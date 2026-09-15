import { useQuery } from "@tanstack/react-query";
import {
  getMemberRoles,
  type GetMemberRolesResponse,
} from "@/services/api/workspace/get-member-roles";
import type { MemberRolesDto } from "@/services/api/workspace/get-my-roles";

export const MEMBER_ROLES_QUERY_KEY = ["workspace-member-roles"];

const useGetMemberRoles = (userId: string) => {
  const query = useQuery<GetMemberRolesResponse, Error>({
    queryKey: [...MEMBER_ROLES_QUERY_KEY, userId],
    queryFn: () => getMemberRoles(userId),
    enabled: !!userId,
  });

  return {
    ...query,
    memberRoles: query.data?.data ?? (null as MemberRolesDto | null),
  };
};

export default useGetMemberRoles;
