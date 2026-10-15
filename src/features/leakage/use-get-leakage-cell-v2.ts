import { useQuery } from "@tanstack/react-query";
import {
  getLeakageCellV2,
  type GetLeakageCellV2Params,
  type GetLeakageCellV2Response,
} from "@/services/api/leakage/get-leakage-cell-v2";

export const LEAKAGE_CELL_V2_QUERY_KEY = (params: GetLeakageCellV2Params) => ["leakage-cell-v2", params];

export const useGetLeakageCellV2 = (params: GetLeakageCellV2Params, enabled = true) =>
  useQuery<GetLeakageCellV2Response, Error>({
    queryKey: LEAKAGE_CELL_V2_QUERY_KEY(params),
    queryFn: () => getLeakageCellV2(params),
    enabled: enabled && !!params.cellId,
  });
