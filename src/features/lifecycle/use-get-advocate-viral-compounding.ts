import { useQuery } from "@tanstack/react-query";
import {
  getAdvocateViralCompounding,
  type GetAdvocateViralCompoundingResponse,
} from "@/services/api/lifecycle/get-advocate-viral-compounding";

export const ADVOCATE_VIRAL_COMPOUNDING_QUERY_KEY = ["lifecycle-advocate-viral-compounding"];

export const useGetAdvocateViralCompounding = () =>
  useQuery<GetAdvocateViralCompoundingResponse, Error>({
    queryKey: ADVOCATE_VIRAL_COMPOUNDING_QUERY_KEY,
    queryFn: getAdvocateViralCompounding,
  });
