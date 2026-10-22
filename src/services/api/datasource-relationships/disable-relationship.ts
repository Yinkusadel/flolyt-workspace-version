import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipEnvelope, RelationshipMapping } from "./types";

export interface DisableRelationshipPayload {
  expectedRevision: number;
  reason: string;
}

export type DisableRelationshipResponse = RelationshipEnvelope<RelationshipMapping>;

const {
  DATASOURCE_RELATIONSHIPS: { DISABLE_RELATIONSHIP },
} = API_ENDPOINTS;

export const disableRelationship = async (
  id: string,
  payload: DisableRelationshipPayload
): Promise<DisableRelationshipResponse> => {
  try {
    const response = await axiosInstance.post<DisableRelationshipResponse>(
      DISABLE_RELATIONSHIP.replace("{id}", id),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to disable relationship");
  }
};
