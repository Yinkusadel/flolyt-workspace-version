import { useQuery } from "@tanstack/react-query";
import { getRenewDunning, type GetRenewDunningResponse } from "@/services/api/lifecycle/get-renew-dunning";

export const RENEW_DUNNING_QUERY_KEY = ["lifecycle-renew-dunning"];

export const useGetRenewDunning = () =>
  useQuery<GetRenewDunningResponse, Error>({
    queryKey: RENEW_DUNNING_QUERY_KEY,
    queryFn: getRenewDunning,
  });
