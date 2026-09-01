import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface EscalateConflictPayload {
  conflictId: string;
  toUserId: string;
  why: string;
}

export interface EscalateConflictResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { ESCALATE_CONFLICT },
} = API_ENDPOINTS;

// Room's owner/members/work untouched; conflict + evidence + both readings travel since they're
// one record. `why` required — the receiver needs to know which part they're being asked to decide.
export const escalateConflict = async ({
  conflictId,
  ...payload
}: EscalateConflictPayload): Promise<EscalateConflictResponse> => {
  try {
    const response = await axiosInstance.post<EscalateConflictResponse>(
      ESCALATE_CONFLICT.replace("{conflictId}", conflictId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to escalate the conflict");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
