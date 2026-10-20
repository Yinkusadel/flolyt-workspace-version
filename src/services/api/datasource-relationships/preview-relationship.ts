import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toRelationshipError } from "./relationship-error";
import type { RelationshipEnvelope, RelationshipPreview } from "./types";

export interface PreviewRelationshipPayload {
  expectedRevision: number;
}

export type PreviewRelationshipResponse = RelationshipEnvelope<RelationshipPreview>;

const {
  DATASOURCE_RELATIONSHIPS: { PREVIEW_RELATIONSHIP },
} = API_ENDPOINTS;

export const previewRelationship = async (
  id: string,
  payload: PreviewRelationshipPayload
): Promise<PreviewRelationshipResponse> => {
  try {
    const response = await axiosInstance.post<PreviewRelationshipResponse>(
      PREVIEW_RELATIONSHIP.replace("{id}", id),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    throw toRelationshipError(error, "Failed to preview relationship");
  }
};
