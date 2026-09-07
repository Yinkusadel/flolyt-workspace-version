import { useQuery } from "@tanstack/react-query";
import {
  getAdvocateReferrers,
  type GetAdvocateReferrersResponse,
} from "@/services/api/lifecycle/get-advocate-referrers";

export const ADVOCATE_REFERRERS_QUERY_KEY = ["lifecycle-advocate-referrers"];

export const useGetAdvocateReferrers = () =>
  useQuery<GetAdvocateReferrersResponse, Error>({
    queryKey: ADVOCATE_REFERRERS_QUERY_KEY,
    queryFn: getAdvocateReferrers,
  });
