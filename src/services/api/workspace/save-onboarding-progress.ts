import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type OnboardingProgressKind =
  | "ViewedStep"
  | "ReviewedMapping"
  | "AcknowledgedAgents"
  | "Finished";

export interface SaveOnboardingProgressPayload {
  kind: OnboardingProgressKind;
  step: string | null;
}

export interface SaveOnboardingProgressResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { SAVE_ONBOARDING_PROGRESS },
} = API_ENDPOINTS;

// Only for the two acts real state can't reconstruct on its own (reviewing the
// mapping, acknowledging the agents) plus ViewedStep/Finished. Naming the workspace,
// declaring markets, choosing a revenue model, connecting a source are all visible
// in real state already — never post those as progress events.
export const saveOnboardingProgress = async (
  payload: SaveOnboardingProgressPayload
): Promise<SaveOnboardingProgressResponse> => {
  try {
    const response = await axiosInstance.post<SaveOnboardingProgressResponse>(
      SAVE_ONBOARDING_PROGRESS,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to save onboarding progress");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
