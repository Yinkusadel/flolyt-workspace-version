import { useQuery } from "@tanstack/react-query";
import {
  getVerifiedThreatBalances,
  type GetVerifiedThreatBalancesParams,
  type GetVerifiedThreatBalancesResponse,
} from "@/services/api/rooms/get-verified-threat-balances";

export const GET_VERIFIED_THREAT_BALANCES_QUERY_KEY = (params?: GetVerifiedThreatBalancesParams) => ["verified-threat-balances", params];

export const useGetVerifiedThreatBalances = (params?: GetVerifiedThreatBalancesParams) =>
  useQuery<GetVerifiedThreatBalancesResponse, Error>({
    queryKey: GET_VERIFIED_THREAT_BALANCES_QUERY_KEY(params),
    queryFn: () => getVerifiedThreatBalances(params),
  });
