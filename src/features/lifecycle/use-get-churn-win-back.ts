import { useQuery } from "@tanstack/react-query";
import { getChurnWinBack, type GetChurnWinBackResponse } from "@/services/api/lifecycle/get-churn-win-back";

export const CHURN_WIN_BACK_QUERY_KEY = ["lifecycle-churn-win-back"];

export const useGetChurnWinBack = () =>
  useQuery<GetChurnWinBackResponse, Error>({
    queryKey: CHURN_WIN_BACK_QUERY_KEY,
    queryFn: getChurnWinBack,
  });
