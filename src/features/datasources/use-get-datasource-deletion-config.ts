import { useQuery } from "@tanstack/react-query";
import {
  getDatasourceDeletionConfig,
  type GetDatasourceDeletionConfigResponse,
  type DatasourceDeletionConfigDto,
} from "@/services/api/datasources/get-datasource-deletion-config";

export const DATASOURCE_DELETION_CONFIG_QUERY_KEY = ["datasource-deletion-config"];

const useGetDatasourceDeletionConfig = () => {
  const query = useQuery<GetDatasourceDeletionConfigResponse, Error>({
    queryKey: DATASOURCE_DELETION_CONFIG_QUERY_KEY,
    queryFn: getDatasourceDeletionConfig,
  });

  return {
    ...query,
    deletionConfig: query.data?.data ?? (null as DatasourceDeletionConfigDto | null),
  };
};

export default useGetDatasourceDeletionConfig;
