import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LearnWhyConversationDto {
  conversationId: string;
  runId: string;
  agentKey: string;
  agentName: string;
  title: string;
  question: string;
  windowDays: number;
}

export interface LearnWhyLeakageStageParams {
  stageKey: string;
  window?: string | number;
  horizon?: string | number;
}

export interface LearnWhyLeakageStageResponse {
  data: LearnWhyConversationDto;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { LEARN_WHY_LEAKAGE_STAGE },
} = API_ENDPOINTS;

// Refused on a stage with no measured figure — a gap is not a question. The conversation/run
// returned here attaches to the existing chat panel's SSE like any other turn.
export const learnWhyLeakageStage = async ({
  stageKey,
  window,
  horizon,
}: LearnWhyLeakageStageParams): Promise<LearnWhyLeakageStageResponse> => {
  try {
    const response = await axiosInstance.post<LearnWhyLeakageStageResponse>(
      LEARN_WHY_LEAKAGE_STAGE.replace("{stageKey}", stageKey),
      null,
      { params: { window, horizon } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to ask why this stage is leaking");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
