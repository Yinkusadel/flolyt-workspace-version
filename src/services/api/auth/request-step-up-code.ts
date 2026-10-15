import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { StepUpAction } from "@/validators/auth";

export interface RequestStepUpCodePayload {
  action: StepUpAction;
}

export interface RequestStepUpCodeResponse {
  succeeded: boolean;
  messages: string[];
  // The handoff doc's example returns the challengeId directly as `data`, not
  // wrapped in an object like login's request-code does — don't "fix" this to match.
  data: string;
}

const {
  USER: { STEP_UP_REQUEST_CODE },
} = API_ENDPOINTS;

export const requestStepUpCode = async (
  payload: RequestStepUpCodePayload
): Promise<RequestStepUpCodeResponse> => {
  try {
    const response = await axiosInstance.post<RequestStepUpCodeResponse>(
      STEP_UP_REQUEST_CODE,
      payload
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "No response from server. Check your internet connection.");
    }

    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
