import { useQuery } from "@tanstack/react-query";
import {
  getRelationships,
  type GetRelationshipsParams,
  type GetRelationshipsResponse,
} from "@/services/api/datasource-relationships/get-relationships";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";

// Root key for every list, detail and history query. Mutations invalidate this one prefix.
export const RELATIONSHIPS_QUERY_KEY = ["datasource-relationships"];

const useGetRelationships = (params?: GetRelationshipsParams) => {
  const query = useQuery<GetRelationshipsResponse, RelationshipApiError>({
    queryKey: [...RELATIONSHIPS_QUERY_KEY, "list", params],
    queryFn: () => getRelationships(params),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    relationships: query.data?.data.mappings ?? ([] as RelationshipMapping[]),
    total: query.data?.data.total ?? 0,
    offset: query.data?.data.offset ?? 0,
    limit: query.data?.data.limit ?? params?.limit ?? 25,
  };
};

export default useGetRelationships;
