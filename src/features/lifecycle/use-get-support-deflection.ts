import { useQuery } from "@tanstack/react-query";
import {
  getSupportDeflection,
  type GetSupportDeflectionResponse,
} from "@/services/api/lifecycle/get-support-deflection";

export const SUPPORT_DEFLECTION_QUERY_KEY = ["lifecycle-support-deflection"];

export const useGetSupportDeflection = () =>
  useQuery<GetSupportDeflectionResponse, Error>({
    queryKey: SUPPORT_DEFLECTION_QUERY_KEY,
    queryFn: getSupportDeflection,
  });
