import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ChooseConflictReadingPayload {
  conflictId: string;
  readingKey: string;
  why: string;
}

export interface ChooseConflictReadingResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CHOOSE_CONFLICT_READING },
} = API_ENDPOINTS;

// Deliberately no way to record a compromise — a figure between two recommendations is one
// nobody proposed and nobody can defend later. `why` required since both sides are supported.
export const chooseConflictReading = async ({
  conflictId,
  ...payload
}: ChooseConflictReadingPayload): Promise<ChooseConflictReadingResponse> => {
  try {
    const response = await axiosInstance.post<ChooseConflictReadingResponse>(
      CHOOSE_CONFLICT_READING.replace("{conflictId}", conflictId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to settle the conflict");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
