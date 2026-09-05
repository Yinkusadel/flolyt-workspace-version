import { useQuery } from "@tanstack/react-query";
import { getRenewPauses, type GetRenewPausesResponse } from "@/services/api/lifecycle/get-renew-pauses";

export const RENEW_PAUSES_QUERY_KEY = ["lifecycle-renew-pauses"];

export const useGetRenewPauses = () =>
  useQuery<GetRenewPausesResponse, Error>({
    queryKey: RENEW_PAUSES_QUERY_KEY,
    queryFn: getRenewPauses,
  });
