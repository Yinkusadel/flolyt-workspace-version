import { useQuery } from "@tanstack/react-query";
import {
  getLeakageConditions,
  type GetLeakageConditionsResponse,
} from "@/services/api/leakage/get-leakage-conditions";

export const useGetLeakageConditions = () =>
  useQuery<GetLeakageConditionsResponse, Error>({
    queryKey: ["leakage-conditions"],
    queryFn: getLeakageConditions,
  });
