import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SlugAvailabilityDto {
  slug: string;
  isAvailable: boolean;
  reason: string | null;
  suggestion: string | null;
}

export interface GetSlugAvailableResponse {
  data: SlugAvailabilityDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { CHECK_SLUG_AVAILABLE },
} = API_ENDPOINTS;

export const getSlugAvailable = async (slug: string): Promise<GetSlugAvailableResponse> => {
  try {
    const response = await axiosInstance.get<GetSlugAvailableResponse>(CHECK_SLUG_AVAILABLE, {
      params: { slug },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to check address availability");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
