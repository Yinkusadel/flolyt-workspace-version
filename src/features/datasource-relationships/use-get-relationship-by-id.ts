import { useQuery } from "@tanstack/react-query";
import {
  getRelationshipById,
  type GetRelationshipByIdResponse,
} from "@/services/api/datasource-relationships/get-relationship-by-id";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import { RELATIONSHIPS_QUERY_KEY } from "./use-get-relationships";

const useGetRelationshipById = (id: string | undefined) => {
  const query = useQuery<GetRelationshipByIdResponse, RelationshipApiError>({
    queryKey: [...RELATIONSHIPS_QUERY_KEY, "detail", id],
    queryFn: () => getRelationshipById(id as string),
    enabled: !!id,
  });

  return {
    ...query,
    relationship: query.data?.data ?? null,
  };
};

export default useGetRelationshipById;
