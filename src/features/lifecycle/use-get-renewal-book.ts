import { useQuery } from "@tanstack/react-query";
import { getRenewalBook, type GetRenewalBookResponse } from "@/services/api/lifecycle/get-renew-renewal-book";

export const RENEWAL_BOOK_QUERY_KEY = ["lifecycle-renew-renewal-book"];

export const useGetRenewalBook = () =>
  useQuery<GetRenewalBookResponse, Error>({
    queryKey: RENEWAL_BOOK_QUERY_KEY,
    queryFn: getRenewalBook,
  });
