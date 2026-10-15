import { useQuery } from "@tanstack/react-query";
import {
  getCreditUsage,
  type GetCreditUsageResponse,
} from "@/services/api/ai-credits/get-credit-usage";

export const useGetCreditUsage = () =>
  useQuery<GetCreditUsageResponse, Error>({
    queryKey: ["credit-usage"],
    queryFn: getCreditUsage,
  });
