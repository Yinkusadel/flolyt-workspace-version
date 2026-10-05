import { useQuery } from "@tanstack/react-query";
import { getLeakageCase } from "@/services/api/leakage/get-leakage-case";
import type { RevenueLeakCaseResponse } from "@/services/api/leakage/leakage-case-types";

export const LEAKAGE_CASE_QUERY_KEY = (caseId: string) => ["leakage-case", caseId];

export const useGetLeakageCase = (caseId: string | undefined, enabled = true) =>
  useQuery<RevenueLeakCaseResponse, Error>({
    queryKey: LEAKAGE_CASE_QUERY_KEY(caseId ?? ""),
    queryFn: () => getLeakageCase(caseId as string),
    enabled: enabled && !!caseId,
  });
