import { useQuery } from "@tanstack/react-query";
import {
  getConnectedDatasources,
  type ConnectedDatasourceDto,
} from "@/services/api/datasources/get-connected-datasources";

export const CONNECTED_DATASOURCES_QUERY_KEY = ["connected-datasources"];

const useGetConnectedDatasources = () => {
  const query = useQuery<ConnectedDatasourceDto[], Error>({
    queryKey: CONNECTED_DATASOURCES_QUERY_KEY,
    queryFn: getConnectedDatasources,
  });

  return {
    ...query,
    connectedDatasources: query.data ?? ([] as ConnectedDatasourceDto[]),
  };
};

export default useGetConnectedDatasources;
