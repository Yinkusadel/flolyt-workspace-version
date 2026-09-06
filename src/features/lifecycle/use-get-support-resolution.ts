import { useQuery } from "@tanstack/react-query";
import {
  getSupportResolution,
  type GetSupportResolutionResponse,
} from "@/services/api/lifecycle/get-support-resolution";

export const SUPPORT_RESOLUTION_QUERY_KEY = ["lifecycle-support-resolution"];

export const useGetSupportResolution = () =>
  useQuery<GetSupportResolutionResponse, Error>({
    queryKey: SUPPORT_RESOLUTION_QUERY_KEY,
    queryFn: getSupportResolution,
  });
