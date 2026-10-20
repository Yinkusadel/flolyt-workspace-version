import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipDefinition, RelationshipEnvelope, RelationshipMapping } from "./types";

export interface CreateRelationshipPayload {
  definition: RelationshipDefinition;
}

export type CreateRelationshipResponse = RelationshipEnvelope<RelationshipMapping>;

const {
  DATASOURCE_RELATIONSHIPS: { CREATE_RELATIONSHIP },
} = API_ENDPOINTS;

export const createRelationship = async (
  payload: CreateRelationshipPayload
): Promise<CreateRelationshipResponse> => {
  try {
    const response = await axiosInstance.post<CreateRelationshipResponse>(
      CREATE_RELATIONSHIP,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to create relationship");
  }
};
