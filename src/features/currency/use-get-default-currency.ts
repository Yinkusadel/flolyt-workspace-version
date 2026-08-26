import { useQuery } from "@tanstack/react-query";
import {
  getDefaultCurrency,
  type GetDefaultCurrencyResponse,
  type DefaultCurrencyDto,
} from "@/services/api/currency/get-default-currency";

export const DEFAULT_CURRENCY_QUERY_KEY = (countryCode: string) => ["default-currency", countryCode];

/** Silent lookup — used to pre-fill a currency field once a country is picked, not shown as its own input. */
const useGetDefaultCurrency = (countryCode: string | null) => {
  const query = useQuery<GetDefaultCurrencyResponse, Error>({
    queryKey: DEFAULT_CURRENCY_QUERY_KEY(countryCode ?? ""),
    queryFn: () => getDefaultCurrency(countryCode as string),
    enabled: Boolean(countryCode),
  });

  return {
    ...query,
    defaultCurrency: query.data?.data ?? (null as DefaultCurrencyDto | null),
  };
};

export default useGetDefaultCurrency;
