import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RetireThreatLessonPayload {
  lessonId: string;
  reason: string;
  /** A different, currently reusable, same-scope lesson that supersedes this one. */
  replacementLessonId: string | null;
}

export interface RetireThreatLessonResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { RETIRE_THREAT_LESSON },
} = API_ENDPOINTS;

// Returns the retirement ID (an identical repeat returns the same one). Retirement does not
// reverse monetary evidence or erase the original review.
export const retireThreatLesson = async (payload: RetireThreatLessonPayload): Promise<RetireThreatLessonResponse> => {
  try {
    const response = await axiosInstance.post<RetireThreatLessonResponse>(
      RETIRE_THREAT_LESSON,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to retire the lesson");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
