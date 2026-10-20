import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipDefinition, RelationshipEnvelope, RelationshipMapping } from "./types";

// Sends the entire write body plus the revision the editor was opened at.
export interface UpdateRelationshipPayload {
  expectedRevision: number;
  definition: RelationshipDefinition;
}

export type UpdateRelationshipResponse = RelationshipEnvelope<RelationshipMapping>;

const {
  DATASOURCE_RELATIONSHIPS: { UPDATE_RELATIONSHIP },
} = API_ENDPOINTS;

export const updateRelationship = async (
  id: string,
  payload: UpdateRelationshipPayload
): Promise<UpdateRelationshipResponse> => {
  try {
    const response = await axiosInstance.put<UpdateRelationshipResponse>(
      UPDATE_RELATIONSHIP.replace("{id}", id),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to update relationship");
  }
};
