import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipEnvelope, RelationshipMapping } from "./types";

export type GetRelationshipByIdResponse = RelationshipEnvelope<RelationshipMapping>;

const {
  DATASOURCE_RELATIONSHIPS: { GET_RELATIONSHIP_BY_ID },
} = API_ENDPOINTS;

export const getRelationshipById = async (id: string): Promise<GetRelationshipByIdResponse> => {
  try {
    const response = await axiosInstance.get<GetRelationshipByIdResponse>(
      GET_RELATIONSHIP_BY_ID.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to fetch relationship");
  }
};
