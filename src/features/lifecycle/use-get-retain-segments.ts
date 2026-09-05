import { useQuery } from "@tanstack/react-query";
import { getRetainSegments, type GetRetainSegmentsResponse } from "@/services/api/lifecycle/get-retain-segments";

export const RETAIN_SEGMENTS_QUERY_KEY = ["lifecycle-retain-segments"];

export const useGetRetainSegments = () =>
  useQuery<GetRetainSegmentsResponse, Error>({
    queryKey: RETAIN_SEGMENTS_QUERY_KEY,
    queryFn: getRetainSegments,
  });
