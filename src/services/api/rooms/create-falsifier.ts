import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateFalsifierPayload {
  roomId: string;
  condition: string;
  thenWhat: string;
}

export interface CreateFalsifierResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_FALSIFIER },
} = API_ENDPOINTS;

// Both halves required — a condition with no stated consequence is a caveat, not a test.
export const createFalsifier = async ({
  roomId,
  condition,
  thenWhat,
}: CreateFalsifierPayload): Promise<CreateFalsifierResponse> => {
  try {
    const response = await axiosInstance.post<CreateFalsifierResponse>(
      CREATE_FALSIFIER.replace("{roomId}", roomId),
      { condition, thenWhat },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to add the falsifier");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
