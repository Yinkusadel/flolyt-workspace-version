import { useQuery } from "@tanstack/react-query";
import {
  getSupportedCurrencies,
  type GetSupportedCurrenciesResponse,
  type SupportedCurrenciesDto,
} from "@/services/api/currency/get-supported-currencies";

export const SUPPORTED_CURRENCIES_QUERY_KEY = ["supported-currencies"];

const useGetSupportedCurrencies = () => {
  const query = useQuery<GetSupportedCurrenciesResponse, Error>({
    queryKey: SUPPORTED_CURRENCIES_QUERY_KEY,
    queryFn: getSupportedCurrencies,
  });

  return {
    ...query,
    supportedCurrencies: query.data?.data ?? (null as SupportedCurrenciesDto | null),
  };
};

export default useGetSupportedCurrencies;
