import { useQuery } from "@tanstack/react-query";
import {
  getSchemaExplorer,
  type GetSchemaExplorerResponse,
  type SchemaExplorerDto,
} from "@/services/api/dataplatform/get-schema-explorer";

export const SCHEMA_EXPLORER_QUERY_KEY = ["schema-explorer"];

const EMPTY_SCHEMA_EXPLORER: SchemaExplorerDto = {
  tables: [],
  totalDatasources: 0,
  totalColumns: 0,
};

const useGetSchemaExplorer = () => {
  const query = useQuery<GetSchemaExplorerResponse, Error>({
    queryKey: SCHEMA_EXPLORER_QUERY_KEY,
    queryFn: getSchemaExplorer,
  });

  return {
    ...query,
    schemaExplorer: query.data?.data ?? EMPTY_SCHEMA_EXPLORER,
  };
};

export default useGetSchemaExplorer;
