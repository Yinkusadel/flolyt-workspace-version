import { useQuery } from "@tanstack/react-query";
import {
  getRelationshipHistory,
  type GetRelationshipHistoryParams,
  type GetRelationshipHistoryResponse,
} from "@/services/api/datasource-relationships/get-relationship-history";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import { RELATIONSHIPS_QUERY_KEY } from "./use-get-relationships";

// Use when the detail reports `historyTruncated`: the detail carries only the latest 50 revisions.
const useGetRelationshipHistory = (
  id: string | undefined,
  params?: GetRelationshipHistoryParams
) => {
  const query = useQuery<GetRelationshipHistoryResponse, RelationshipApiError>({
    queryKey: [...RELATIONSHIPS_QUERY_KEY, "history", id, params],
    queryFn: () => getRelationshipHistory(id as string, params),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    revisions: query.data?.data.revisions ?? ([] as Record<string, unknown>[]),
    total: query.data?.data.total ?? 0,
    hasMore: query.data?.data.hasMore ?? false,
  };
};

export default useGetRelationshipHistory;
