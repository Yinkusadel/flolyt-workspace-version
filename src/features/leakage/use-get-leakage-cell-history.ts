import { useQuery } from "@tanstack/react-query";
import {
  getLeakageCellHistory,
  type GetLeakageCellHistoryParams,
  type GetLeakageCellHistoryResponse,
} from "@/services/api/leakage/get-leakage-cell-history";

export const LEAKAGE_CELL_HISTORY_QUERY_KEY = (params: GetLeakageCellHistoryParams) => ["leakage-cell-history", params];

export const useGetLeakageCellHistory = (params: GetLeakageCellHistoryParams, enabled = true) =>
  useQuery<GetLeakageCellHistoryResponse, Error>({
    queryKey: LEAKAGE_CELL_HISTORY_QUERY_KEY(params),
    queryFn: () => getLeakageCellHistory(params),
    enabled: enabled && !!params.cellId,
  });
