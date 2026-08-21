import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LogoutPayload {
  refreshToken?: string;
}

export interface LogoutResponse {
  succeeded: boolean;
  messages?: string[];
}

const {
  USER: { LOGOUT },
} = API_ENDPOINTS;

export const logoutUser = async (payload: LogoutPayload): Promise<LogoutResponse> => {
  try {
    const response = await axiosInstance.post<LogoutResponse>(LOGOUT, payload);

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
