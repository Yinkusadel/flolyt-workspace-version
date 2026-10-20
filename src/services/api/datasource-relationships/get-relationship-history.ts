import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type {
  RelationshipEnvelope,
  RelationshipHistoryPage,
  RelationshipPageParams,
} from "./types";

export type GetRelationshipHistoryParams = RelationshipPageParams;

export type GetRelationshipHistoryResponse = RelationshipEnvelope<RelationshipHistoryPage>;

const {
  DATASOURCE_RELATIONSHIPS: { GET_RELATIONSHIP_HISTORY },
} = API_ENDPOINTS;

export const getRelationshipHistory = async (
  id: string,
  params?: GetRelationshipHistoryParams
): Promise<GetRelationshipHistoryResponse> => {
  try {
    const response = await axiosInstance.get<GetRelationshipHistoryResponse>(
      GET_RELATIONSHIP_HISTORY.replace("{id}", id),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to fetch relationship history");
  }
};
