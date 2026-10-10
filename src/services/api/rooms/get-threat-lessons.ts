import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetThreatLessonsParams {
  /** Pages of 25, ordered by creation time then ID. Follow `nextPage` until null. */
  page?: number;
}

export interface ThreatLessonRetirement {
  // ❌ Shape not shown in the handoff; typed loosely.
  [key: string]: unknown;
}

export interface ThreatLessonDto {
  // ❌ Only the fields the handoff names are typed here; the rest of the item is not shown.
  id?: string;
  /** False overrides a historical PROMOTED review (the evidence was reversed). */
  evidenceStillValid: boolean;
  /** Retired/superseded status. Show separately from `evidenceStillValid` and `review.decision`. */
  retirement: ThreatLessonRetirement | null;
  /** False for retired lessons and for restricted source Rooms. */
  reusable: boolean;
  review?: { decision: "PROMOTED" | "REJECTED" | string } | null;
  outcomeStatus?: string | null;
  qualifications?: string[];
}

export interface ThreatLessonsData {
  items: ThreatLessonDto[];
  nextPage: number | null;
}

export interface GetThreatLessonsResponse {
  data: ThreatLessonsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_THREAT_LESSONS },
} = API_ENDPOINTS;

// Admin review list. `items` excludes Rooms the administrator cannot access. A promoted lesson
// is a historical recommendation, not an approved action or guaranteed recovery.
export const getThreatLessons = async (params?: GetThreatLessonsParams): Promise<GetThreatLessonsResponse> => {
  try {
    const response = await axiosInstance.get<GetThreatLessonsResponse>(GET_THREAT_LESSONS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch lessons");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
