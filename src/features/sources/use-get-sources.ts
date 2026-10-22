import { useQuery } from "@tanstack/react-query";
import { getSources, type GetSourcesResponse } from "@/services/api/sources/get-sources";

export const SOURCES_QUERY_KEY = ["sources"];

export const useGetSources = () =>
  useQuery<GetSourcesResponse, Error>({
    queryKey: SOURCES_QUERY_KEY,
    queryFn: () => getSources(),
  });
