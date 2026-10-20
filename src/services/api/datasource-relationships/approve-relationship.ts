import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipEnvelope, RelationshipMapping } from "./types";

// `previewId` is the server-issued receipt from the preview call. Clients never send match
// statistics. `acceptPartial` must be true to approve a partial preview.
export interface ApproveRelationshipPayload {
  expectedRevision: number;
  previewId: string;
  acceptPartial: boolean;
}

export type ApproveRelationshipResponse = RelationshipEnvelope<RelationshipMapping>;

const {
  DATASOURCE_RELATIONSHIPS: { APPROVE_RELATIONSHIP },
} = API_ENDPOINTS;

export const approveRelationship = async (
  id: string,
  payload: ApproveRelationshipPayload
): Promise<ApproveRelationshipResponse> => {
  try {
    const response = await axiosInstance.post<ApproveRelationshipResponse>(
      APPROVE_RELATIONSHIP.replace("{id}", id),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to approve relationship");
  }
};
