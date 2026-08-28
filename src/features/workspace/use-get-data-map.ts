import { useQuery } from "@tanstack/react-query";
import { getDataMap, type GetDataMapResponse, type DataMapDto } from "@/services/api/workspace/get-data-map";

export const DATA_MAP_QUERY_KEY = ["workspace-data-map"];

// rowCount is a rounded warehouse ESTIMATE, not a rate — 0 means empty OR never counted
// (summary.uncountedTableCount says how much is unknown). mappedTo: null means "not mapped",
// still render the row. state/flags mirror useGetMappingQuality's — check .state before
// treating an empty .flags array as "all good".
const useGetDataMap = (enabled: boolean = true) => {
  const query = useQuery<GetDataMapResponse, Error>({
    queryKey: DATA_MAP_QUERY_KEY,
    queryFn: getDataMap,
    enabled,
  });

  return {
    ...query,
    dataMap: query.data?.data ?? (null as DataMapDto | null),
  };
};

export default useGetDataMap;
