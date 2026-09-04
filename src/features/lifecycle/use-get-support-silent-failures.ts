import { useQuery } from "@tanstack/react-query";
import {
  getSupportSilentFailures,
  type GetSupportSilentFailuresResponse,
} from "@/services/api/lifecycle/get-support-silent-failures";

export const SUPPORT_SILENT_FAILURES_QUERY_KEY = ["lifecycle-support-silent-failures"];

export const useGetSupportSilentFailures = () =>
  useQuery<GetSupportSilentFailuresResponse, Error>({
    queryKey: SUPPORT_SILENT_FAILURES_QUERY_KEY,
    queryFn: getSupportSilentFailures,
  });
