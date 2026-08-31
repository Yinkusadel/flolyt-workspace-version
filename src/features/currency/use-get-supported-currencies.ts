import { useQuery } from "@tanstack/react-query";
import {
  getSupportedCurrencies,
  type GetSupportedCurrenciesResponse,
} from "@/services/api/currency/get-supported-currencies";

export const SUPPORTED_CURRENCIES_QUERY_KEY = ["supported-currencies"];

const useGetSupportedCurrencies = () => {
  const query = useQuery<GetSupportedCurrenciesResponse, Error>({
    queryKey: SUPPORTED_CURRENCIES_QUERY_KEY,
    queryFn: getSupportedCurrencies,
  });

  return {
    ...query,
    supportedCurrencies: query.data ?? null,
  };
};

export default useGetSupportedCurrencies;
