import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateDissentPayload {
  roomId: string;
  wording: string;
  aboutProposalId: string | null;
}

export interface CreateDissentResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_DISSENT },
} = API_ENDPOINTS;

// Does NOT block the decision and nothing tallies it — rooms aren't democracies, no threshold.
export const createDissent = async ({
  roomId,
  ...payload
}: CreateDissentPayload): Promise<CreateDissentResponse> => {
  try {
    const response = await axiosInstance.post<CreateDissentResponse>(
      CREATE_DISSENT.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to record the objection");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
