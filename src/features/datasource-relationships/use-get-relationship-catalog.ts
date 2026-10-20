import { useQuery } from "@tanstack/react-query";
import {
  getRelationshipCatalog,
  type GetRelationshipCatalogResponse,
} from "@/services/api/datasource-relationships/get-relationship-catalog";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type {
  RelationshipCatalogDataset,
  RelationshipSuggestion,
} from "@/services/api/datasource-relationships/types";

export const RELATIONSHIP_CATALOG_QUERY_KEY = ["datasource-relationship-catalog"];

const useGetRelationshipCatalog = () => {
  const query = useQuery<GetRelationshipCatalogResponse, RelationshipApiError>({
    queryKey: RELATIONSHIP_CATALOG_QUERY_KEY,
    queryFn: getRelationshipCatalog,
  });

  return {
    ...query,
    datasets: query.data?.data.datasets ?? ([] as RelationshipCatalogDataset[]),
    suggestions: query.data?.data.suggestions ?? ([] as RelationshipSuggestion[]),
  };
};

export default useGetRelationshipCatalog;
