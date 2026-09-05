import { useQuery } from "@tanstack/react-query";
import { getAdoptDepth, type GetAdoptDepthResponse } from "@/services/api/lifecycle/get-adopt-depth";

export const ADOPT_DEPTH_QUERY_KEY = ["lifecycle-adopt-depth"];

export const useGetAdoptDepth = () =>
  useQuery<GetAdoptDepthResponse, Error>({
    queryKey: ADOPT_DEPTH_QUERY_KEY,
    queryFn: getAdoptDepth,
  });
