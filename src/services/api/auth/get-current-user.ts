import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CurrentUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  role: string;
  companyId: string | null;
  companyName: string | null;
  onboardingRequired: boolean;
}

export interface GetCurrentUserResponse {
  data: CurrentUserDto;
  messages: string[];
  succeeded: boolean;
}

const {
  USER: { GET_ME },
} = API_ENDPOINTS;

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  try {
    const response = await axiosInstance.get<GetCurrentUserResponse>(GET_ME);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the signed-in user");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
