import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface OnboardingStepDto {
  step: string;
  isComplete: boolean;
  satisfiedAtUtc: string | null;
  outstanding: string[];
}

export interface OnboardingStatusDto {
  started: boolean;
  finished: boolean;
  completedSteps: number;
  totalSteps: number;
  resumeAt: string;
  lastTouchedAtUtc: string | null;
  stalledForDays: number | null;
  steps: OnboardingStepDto[];
}

export interface GetOnboardingStatusResponse {
  data: OnboardingStatusDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_ONBOARDING_STATUS },
} = API_ENDPOINTS;

export const getOnboardingStatus = async (): Promise<GetOnboardingStatusResponse> => {
  try {
    const response = await axiosInstance.get<GetOnboardingStatusResponse>(GET_ONBOARDING_STATUS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch onboarding status");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
