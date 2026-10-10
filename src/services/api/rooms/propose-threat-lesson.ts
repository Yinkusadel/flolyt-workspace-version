import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ProposeThreatLessonPayload {
  roomId: string;
  verificationId: string;
  /** Must match the verification plan's `boundResolutionPlanId`; any other revision is rejected. */
  resolutionPlanId: string;
}

export interface ProposeThreatLessonResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { PROPOSE_THREAT_LESSON },
} = API_ENDPOINTS;

// Returns the lesson ID (a repeat returns the same one). Older unbound verifications and
// condition-only/manual procedures fail with an explanation; do not suggest re-verifying.
export const proposeThreatLesson = async (payload: ProposeThreatLessonPayload): Promise<ProposeThreatLessonResponse> => {
  try {
    const response = await axiosInstance.post<ProposeThreatLessonResponse>(
      PROPOSE_THREAT_LESSON,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to propose the lesson");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
