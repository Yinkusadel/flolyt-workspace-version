import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ReviewThreatLessonPayload {
  lessonId: string;
  decision: "PROMOTED" | "REJECTED";
  reason: string;
}

export interface ReviewThreatLessonResponse {
  data: unknown;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REVIEW_THREAT_LESSON },
} = API_ENDPOINTS;

// ❌ Shape not shown in the handoff (docs/rooms/revenue-threat-room-frontend-handoff.md); typed loosely until a real payload is seen.
// The proposer, resolution author, action owners and excluded intervention authors cannot promote.
export const reviewThreatLesson = async (payload: ReviewThreatLessonPayload): Promise<ReviewThreatLessonResponse> => {
  try {
    const response = await axiosInstance.post<ReviewThreatLessonResponse>(
      REVIEW_THREAT_LESSON,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to review the lesson");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
