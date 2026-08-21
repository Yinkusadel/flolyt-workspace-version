import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  USER: { REGISTER },
} = API_ENDPOINTS;

export const registerUser = async (payload: RegisterUserPayload): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(REGISTER, payload);

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
