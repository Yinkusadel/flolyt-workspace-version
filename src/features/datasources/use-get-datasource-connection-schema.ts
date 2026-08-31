import { useQuery } from "@tanstack/react-query";
import {
  getDatasourceConnectionSchema,
  type GetDatasourceConnectionSchemaResponse,
  type DatasourceConnectionSchemaDto,
} from "@/services/api/datasources/get-datasource-connection-schema";

export const DATASOURCE_CONNECTION_SCHEMA_QUERY_KEY = ["datasource-connection-schema"];

const useGetDatasourceConnectionSchema = (name: string) => {
  const query = useQuery<GetDatasourceConnectionSchemaResponse, Error>({
    queryKey: [...DATASOURCE_CONNECTION_SCHEMA_QUERY_KEY, name],
    queryFn: () => getDatasourceConnectionSchema(name),
    enabled: !!name,
  });

  return {
    ...query,
    connectionSchema: query.data?.data ?? (null as DatasourceConnectionSchemaDto | null),
  };
};

export default useGetDatasourceConnectionSchema;
