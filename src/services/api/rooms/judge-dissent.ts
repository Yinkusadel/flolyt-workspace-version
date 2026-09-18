import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface JudgeDissentPayload {
  dissentId: string;
  borneOut: boolean;
}

export interface JudgeDissentResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { JUDGE_DISSENT },
} = API_ENDPOINTS;

// Null until judged — "unjudged" and "shown-to-be-wrong" are different, and the second is the
// useful state.
export const judgeDissent = async ({
  dissentId,
  borneOut,
}: JudgeDissentPayload): Promise<JudgeDissentResponse> => {
  try {
    const response = await axiosInstance.post<JudgeDissentResponse>(
      JUDGE_DISSENT.replace("{dissentId}", dissentId),
      { borneOut },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to judge the objection");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
