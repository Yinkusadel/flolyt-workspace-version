import { useQuery } from "@tanstack/react-query";
import {
  getDatasourceDisconnections,
  type GetDatasourceDisconnectionsParams,
  type GetDatasourceDisconnectionsResponse,
  type DatasourceDisconnectionDto,
} from "@/services/api/datasources/get-datasource-disconnections";

export const DATASOURCE_DISCONNECTIONS_QUERY_KEY = ["datasource-disconnections"];

const useGetDatasourceDisconnections = (params?: GetDatasourceDisconnectionsParams) => {
  const query = useQuery<GetDatasourceDisconnectionsResponse, Error>({
    queryKey: [...DATASOURCE_DISCONNECTIONS_QUERY_KEY, params],
    queryFn: () => getDatasourceDisconnections(params),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    disconnections: query.data?.data ?? ([] as DatasourceDisconnectionDto[]),
  };
};

export default useGetDatasourceDisconnections;
