import { useQuery } from "@tanstack/react-query";
import {
  getUserByEmail,
  type GetUserByEmailResponse,
  type UserDto,
} from "@/services/api/auth/get-user-by-email";

const USER_BY_EMAIL_QUERY_KEY = ["userByEmail"];

const useGetUserByEmail = (email: string) => {
  const query = useQuery<GetUserByEmailResponse, Error>({
    queryKey: [...USER_BY_EMAIL_QUERY_KEY, email],
    queryFn: () => getUserByEmail(email),
     enabled: !!email,
  });

  return {
    ...query,
    user: query.data?.data ?? (null as UserDto | null),
  };
};

export default useGetUserByEmail;
