import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUser,
  type GetCurrentUserResponse,
  type CurrentUserDto,
} from "@/services/api/auth/get-current-user";

const CURRENT_USER_QUERY_KEY = ["currentUser"];

const useGetCurrentUser = (enabled: boolean) => {
  const query = useQuery<GetCurrentUserResponse, Error>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => getCurrentUser(),
    enabled,
  });

  return {
    ...query,
    user: query.data?.data ?? (null as CurrentUserDto | null),
  };
};

export default useGetCurrentUser;
