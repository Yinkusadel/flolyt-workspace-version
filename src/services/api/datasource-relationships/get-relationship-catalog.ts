import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipCatalog, RelationshipEnvelope } from "./types";

export type GetRelationshipCatalogResponse = RelationshipEnvelope<RelationshipCatalog>;

const {
  DATASOURCE_RELATIONSHIPS: { GET_RELATIONSHIP_CATALOG },
} = API_ENDPOINTS;

export const getRelationshipCatalog = async (): Promise<GetRelationshipCatalogResponse> => {
  try {
    const response = await axiosInstance.get<GetRelationshipCatalogResponse>(
      GET_RELATIONSHIP_CATALOG
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to fetch the relationship catalog");
  }
};
