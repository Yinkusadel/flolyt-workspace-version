import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface MarkFalsifierMetPayload {
  roomId: string;
  index: number;
}

export interface MarkFalsifierMetResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { MARK_FALSIFIER_MET },
} = API_ENDPOINTS;

// Idempotent — a second call succeeds without moving the timestamp; when it first fired is the record.
export const markFalsifierMet = async ({
  roomId,
  index,
}: MarkFalsifierMetPayload): Promise<MarkFalsifierMetResponse> => {
  try {
    const response = await axiosInstance.post<MarkFalsifierMetResponse>(
      MARK_FALSIFIER_MET.replace("{roomId}", roomId).replace("{index}", String(index))
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to mark the falsifier as met");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
