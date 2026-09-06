import { useQuery } from "@tanstack/react-query";
import { getActivatePaths, type GetActivatePathsResponse } from "@/services/api/lifecycle/get-activate-paths";

export const ACTIVATE_PATHS_QUERY_KEY = ["lifecycle-activate-paths"];

export const useGetActivatePaths = () =>
  useQuery<GetActivatePathsResponse, Error>({
    queryKey: ACTIVATE_PATHS_QUERY_KEY,
    queryFn: getActivatePaths,
  });
