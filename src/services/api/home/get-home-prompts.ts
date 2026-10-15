import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface HomePromptContext {
  stage: string | null;
  grid: string | null;
  rowKey: string | null;
  conditionKey: string | null;
  currency: string | null;
}

export interface HomePromptDto {
  key: string;
  text: string;
  intent: string;
  because: string;
  context: HomePromptContext;
}

export interface HomePromptsDto {
  greeting: string;
  prompts: HomePromptDto[];
}

export interface GetHomePromptsResponse {
  data: HomePromptsDto;
  messages: string[];
  succeeded: boolean;
}

const {
  HOME: { GET_PROMPTS },
} = API_ENDPOINTS;

export const getHomePrompts = async (): Promise<GetHomePromptsResponse> => {
  try {
    const response = await axiosInstance.get<GetHomePromptsResponse>(GET_PROMPTS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch home prompts");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
