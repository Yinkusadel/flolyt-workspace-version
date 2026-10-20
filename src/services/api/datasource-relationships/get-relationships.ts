import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type {
  RelationshipEnvelope,
  RelationshipListPage,
  RelationshipPageParams,
} from "./types";

export type GetRelationshipsParams = RelationshipPageParams;

export type GetRelationshipsResponse = RelationshipEnvelope<RelationshipListPage>;

const {
  DATASOURCE_RELATIONSHIPS: { GET_RELATIONSHIPS },
} = API_ENDPOINTS;

export const getRelationships = async (
  params?: GetRelationshipsParams
): Promise<GetRelationshipsResponse> => {
  try {
    const response = await axiosInstance.get<GetRelationshipsResponse>(GET_RELATIONSHIPS, {
      params,
    });

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to fetch relationships");
  }
};
