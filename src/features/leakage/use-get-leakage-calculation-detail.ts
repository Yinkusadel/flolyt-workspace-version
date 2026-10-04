import { useQuery } from "@tanstack/react-query";
import {
  getLeakageCalculationDetail,
  type GetLeakageCalculationDetailParams,
  type GetLeakageCalculationDetailResponse,
} from "@/services/api/leakage/get-leakage-calculation-detail";

export const LEAKAGE_CALCULATION_DETAIL_QUERY_KEY = (params: GetLeakageCalculationDetailParams) => [
  "leakage-calculation-detail",
  params,
];

/**
 * `retry: false` — a failed result here is meaningful (invalid/foreign/unpublished reference, totals that
 * can't reconcile), so the drawer should show "unavailable" straight away, not retry into the same answer.
 */
export const useGetLeakageCalculationDetail = (params: GetLeakageCalculationDetailParams, enabled = true) =>
  useQuery<GetLeakageCalculationDetailResponse, Error>({
    queryKey: LEAKAGE_CALCULATION_DETAIL_QUERY_KEY(params),
    queryFn: () => getLeakageCalculationDetail(params),
    enabled: enabled && !!params.calculationReference,
    retry: false,
  });
