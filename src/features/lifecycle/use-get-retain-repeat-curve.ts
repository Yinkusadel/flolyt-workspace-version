import { useQuery } from "@tanstack/react-query";
import {
  getRetainRepeatCurve,
  type GetRetainRepeatCurveResponse,
} from "@/services/api/lifecycle/get-retain-repeat-curve";

export const RETAIN_REPEAT_CURVE_QUERY_KEY = ["lifecycle-retain-repeat-curve"];

export const useGetRetainRepeatCurve = () =>
  useQuery<GetRetainRepeatCurveResponse, Error>({
    queryKey: RETAIN_REPEAT_CURVE_QUERY_KEY,
    queryFn: getRetainRepeatCurve,
  });
