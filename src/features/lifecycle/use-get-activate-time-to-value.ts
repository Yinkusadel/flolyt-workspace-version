import { useQuery } from "@tanstack/react-query";
import {
  getActivateTimeToValue,
  type GetActivateTimeToValueResponse,
} from "@/services/api/lifecycle/get-activate-time-to-value";

export const ACTIVATE_TIME_TO_VALUE_QUERY_KEY = ["lifecycle-activate-time-to-value"];

export const useGetActivateTimeToValue = () =>
  useQuery<GetActivateTimeToValueResponse, Error>({
    queryKey: ACTIVATE_TIME_TO_VALUE_QUERY_KEY,
    queryFn: getActivateTimeToValue,
  });
