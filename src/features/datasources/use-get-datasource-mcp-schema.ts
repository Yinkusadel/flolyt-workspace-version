import { useQuery } from "@tanstack/react-query";
import { getDatasourceMcpSchema } from "@/services/api/datasources/get-datasource-mcp-schema";
import type { GetDatasourceMcpSchemaResponse } from "@/services/api/datasources/get-datasource-mcp-schema";

export const DATASOURCE_MCP_SCHEMA_QUERY_KEY = ["datasource-mcp-schema"];

const useGetDatasourceMcpSchema = (id: string) => {
  const query = useQuery<GetDatasourceMcpSchemaResponse, Error>({
    queryKey: [...DATASOURCE_MCP_SCHEMA_QUERY_KEY, id],
    queryFn: () => getDatasourceMcpSchema(id),
    enabled: !!id,
  });

  return {
    ...query,
    schema: query.data?.data ?? null,
  };
};

export default useGetDatasourceMcpSchema;
