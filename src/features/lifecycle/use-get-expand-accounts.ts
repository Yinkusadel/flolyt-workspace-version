import { useQuery } from "@tanstack/react-query";
import { getExpandAccounts, type GetExpandAccountsResponse } from "@/services/api/lifecycle/get-expand-accounts";

export const EXPAND_ACCOUNTS_QUERY_KEY = ["lifecycle-expand-accounts"];

export const useGetExpandAccounts = () =>
  useQuery<GetExpandAccountsResponse, Error>({
    queryKey: EXPAND_ACCOUNTS_QUERY_KEY,
    queryFn: getExpandAccounts,
  });
