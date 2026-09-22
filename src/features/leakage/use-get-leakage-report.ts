import { useQuery } from "@tanstack/react-query";
import {
  getLeakageReport,
  type GetLeakageReportParams,
  type GetLeakageReportResponse,
} from "@/services/api/leakage/get-leakage-report";

export const LEAKAGE_REPORT_QUERY_KEY = (params?: GetLeakageReportParams) => [
  "leakage-report",
  params,
];

export const useGetLeakageReport = (params?: GetLeakageReportParams) =>
  useQuery<GetLeakageReportResponse, Error>({
    queryKey: LEAKAGE_REPORT_QUERY_KEY(params),
    queryFn: () => getLeakageReport(params),
  });
