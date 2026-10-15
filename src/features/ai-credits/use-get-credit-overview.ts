import { useQuery } from "@tanstack/react-query";
import {
  getCreditOverview,
  type GetCreditOverviewResponse,
} from "@/services/api/ai-credits/get-credit-overview";

export const useGetCreditOverview = () =>
  useQuery<GetCreditOverviewResponse, Error>({
    queryKey: ["credit-overview"],
    queryFn: getCreditOverview,
  });
