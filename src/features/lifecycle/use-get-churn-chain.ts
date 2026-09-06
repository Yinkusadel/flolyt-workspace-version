import { useQuery } from "@tanstack/react-query";
import {
  getChurnChain,
  type GetChurnChainParams,
  type GetChurnChainResponse,
} from "@/services/api/lifecycle/get-churn-chain";

export const CHURN_CHAIN_QUERY_KEY = (params?: GetChurnChainParams) => ["lifecycle-churn-chain", params];

export const useGetChurnChain = (params?: GetChurnChainParams) =>
  useQuery<GetChurnChainResponse, Error>({
    queryKey: CHURN_CHAIN_QUERY_KEY(params),
    queryFn: () => getChurnChain(params),
  });
