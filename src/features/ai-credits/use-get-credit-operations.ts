import { useQuery } from "@tanstack/react-query";
import {
  getCreditOperations,
  type GetCreditOperationsResponse,
} from "@/services/api/ai-credits/get-credit-operations";

export const useGetCreditOperations = () =>
  useQuery<GetCreditOperationsResponse, Error>({
    queryKey: ["credit-operations"],
    queryFn: getCreditOperations,
  });
