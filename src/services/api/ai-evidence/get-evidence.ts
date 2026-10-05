import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { CanonicalIntelligenceProjection } from "@/features/ai-evidence/ai-evidence-types";
import type { IntelligenceReference } from "@/features/ai-conversations/agent-intelligence-types";

export interface GetEvidenceParams {
  kind: IntelligenceReference["kind"];
  referenceId: string;
}

export interface GetEvidenceResponse {
  data: CanonicalIntelligenceProjection;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_EVIDENCE: { GET_BY_REFERENCE },
} = API_ENDPOINTS;

// Route kinds are case-insensitive server-side, but we always send the canonical
// IntelligenceReference["kind"] casing. A 404 means "unavailable or inaccessible" — the doc says
// not to reveal which case applied, so callers should render both the same way, not branch on it.
export const getEvidence = async ({
  kind,
  referenceId,
}: GetEvidenceParams): Promise<GetEvidenceResponse> => {
  try {
    const response = await axiosInstance.get<GetEvidenceResponse>(
      GET_BY_REFERENCE.replace("{kind}", kind).replace("{referenceId}", referenceId),
      { headers: { "X-Flolyt-Agent-Contract": "v3" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch evidence");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
