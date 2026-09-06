import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateConflictReadingInput {
  key: string;
  label: string;
  recommends: string;
  because: string;
  evidenceClaimIds: string[];
  expectedReach: number | null;
  expectedEffect: number | null;
  currency: string | null;
  effectUnavailableBecause: string | null;
  longRunEffect: string | null;
}

export interface CreateConflictPayload {
  roomId: string;
  summary: string;
  readings: CreateConflictReadingInput[];
}

export interface CreateConflictResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_CONFLICT },
} = API_ENDPOINTS;

// Refused with only one reading — that's a recommendation, not a dispute. Waits on the room's
// decision owner.
export const createConflict = async ({
  roomId,
  ...payload
}: CreateConflictPayload): Promise<CreateConflictResponse> => {
  try {
    const response = await axiosInstance.post<CreateConflictResponse>(
      CREATE_CONFLICT.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to raise the conflict");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
