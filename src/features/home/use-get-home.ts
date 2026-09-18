import { useQuery } from "@tanstack/react-query";
import { getHome, type GetHomeParams, type GetHomeResponse } from "@/services/api/home/get-home";

export const HOME_QUERY_KEY = (params?: GetHomeParams) => ["home", params];

export const useGetHome = (params?: GetHomeParams) =>
  useQuery<GetHomeResponse, Error>({
    queryKey: HOME_QUERY_KEY(params),
    queryFn: () => getHome(params),
  });
