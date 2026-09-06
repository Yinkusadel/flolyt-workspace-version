import { useQuery } from "@tanstack/react-query";
import { getInstrumentation, type GetInstrumentationResponse } from "@/services/api/lifecycle/get-instrumentation";

export const INSTRUMENTATION_QUERY_KEY = ["lifecycle-instrumentation"];

export const useGetInstrumentation = () =>
  useQuery<GetInstrumentationResponse, Error>({
    queryKey: INSTRUMENTATION_QUERY_KEY,
    queryFn: getInstrumentation,
  });
