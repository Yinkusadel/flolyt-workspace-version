import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";

export interface VerifyStepUpCodePayload {
  challengeId: string;
  code: string;
}

export interface VerifyStepUpCodeResponse {
  succeeded: boolean;
  messages: string[];
}

const {
  USER: { STEP_UP_VERIFY_CODE },
} = API_ENDPOINTS;

export const verifyStepUpCode = async (
  payload: VerifyStepUpCodePayload
): Promise<VerifyStepUpCodeResponse> => {
  try {
    const response = await axiosInstance.post<VerifyStepUpCodeResponse>(
      STEP_UP_VERIFY_CODE,
      payload
    );

    return response.data;
  } catch (error: unknown) {
    // Same "one message for every failure reason" shape as login's verify-code —
    // wrong, expired, spent, out of attempts, no such challenge all read identically.
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { messages?: string[] } | undefined;
      throw new Error(
        data?.messages?.join(", ") || "That code is not valid. Request a new one and try again."
      );
    }

    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
