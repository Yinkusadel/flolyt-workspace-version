import type { QueryClient } from "@tanstack/react-query";
import type { GetRelationshipByIdResponse } from "@/services/api/datasource-relationships/get-relationship-by-id";
import type { GetRelationshipsResponse } from "@/services/api/datasource-relationships/get-relationships";
import type { RelationshipMapping } from "@/services/api/datasource-relationships/types";
import { RELATIONSHIPS_QUERY_KEY } from "./use-get-relationships";

/**
 * Run after a relationship write succeeds. Two steps, so the next screen is never stale:
 * 1. Put the returned mapping straight into the cached list rows and detail, so what is on screen is
 *    right at once. Write responses carry no full history, so the detail keeps its cached history
 *    until step 2 replaces it.
 * 2. Invalidate and refetch every relationship query, inactive ones included. A plain invalidate
 *    only refetches queries that are on screen, so the list (not mounted while you edit the detail
 *    page) would show its old rows until it remounted. The caller awaits this before navigating.
 */
export async function refreshRelationships(queryClient: QueryClient, mapping?: RelationshipMapping) {
  if (mapping) {
    queryClient.setQueriesData<GetRelationshipsResponse>(
      { queryKey: [...RELATIONSHIPS_QUERY_KEY, "list"] },
      (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data,
                mappings: old.data.mappings.map((row) =>
                  row.id === mapping.id ? { ...row, ...mapping } : row
                ),
              },
            }
          : old
    );
    queryClient.setQueryData<GetRelationshipByIdResponse>(
      [...RELATIONSHIPS_QUERY_KEY, "detail", mapping.id],
      (old) => (old ? { ...old, data: { ...old.data, ...mapping } } : old)
    );
  }

  await queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY, refetchType: "all" });
}
