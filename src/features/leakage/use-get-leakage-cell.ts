import { useQuery } from "@tanstack/react-query";
import {
  getLeakageCell,
  type GetLeakageCellParams,
  type GetLeakageCellResponse,
} from "@/services/api/leakage/get-leakage-cell";

export const LEAKAGE_CELL_QUERY_KEY = (params: GetLeakageCellParams) => ["leakage-cell", params];

export const useGetLeakageCell = (params: GetLeakageCellParams, enabled = true) =>
  useQuery<GetLeakageCellResponse, Error>({
    queryKey: LEAKAGE_CELL_QUERY_KEY(params),
    queryFn: () => getLeakageCell(params),
    enabled: enabled && !!params.grid && !!params.row && !!params.condition && !!params.currency,
  });
