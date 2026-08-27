import { useQuery } from "@tanstack/react-query";
import {
  getDatasources,
  type GetDatasourcesResponse,
  type DatasourceDto,
} from "@/services/api/datasources/get-datasources";

export const DATASOURCES_QUERY_KEY = ["datasources"];

const useGetDatasources = () => {
  const query = useQuery<GetDatasourcesResponse, Error>({
    queryKey: DATASOURCES_QUERY_KEY,
    queryFn: getDatasources,
  });

  return {
    ...query,
    datasources: query.data?.data ?? ([] as DatasourceDto[]),
  };
};

export default useGetDatasources;
