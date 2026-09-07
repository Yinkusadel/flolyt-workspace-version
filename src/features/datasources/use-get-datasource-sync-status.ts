import { useQuery } from "@tanstack/react-query";
import {
  getDatasourceSyncStatus,
  type GetDatasourceSyncStatusResponse,
  type DatasourceSyncStatusDto,
} from "@/services/api/datasources/get-datasource-sync-status";

export const DATASOURCE_SYNC_STATUS_QUERY_KEY = ["datasource-sync-status"];

const useGetDatasourceSyncStatus = (id: string) => {
  const query = useQuery<GetDatasourceSyncStatusResponse, Error>({
    queryKey: [...DATASOURCE_SYNC_STATUS_QUERY_KEY, id],
    queryFn: () => getDatasourceSyncStatus(id),
    enabled: !!id,
  });

  return {
    ...query,
    syncStatus: query.data?.data ?? (null as DatasourceSyncStatusDto | null),
  };
};

export default useGetDatasourceSyncStatus;
