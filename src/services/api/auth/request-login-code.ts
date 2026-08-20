import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RequestLoginCodePayload {
  email: string;
}

export interface RequestLoginCodeResponse {
  succeeded: boolean;
  messages: string[];
  data: { challengeId: string };
}

const {
  USER: { REQUEST_LOGIN_CODE },
} = API_ENDPOINTS;

export const requestLoginCode = async (
  payload: RequestLoginCodePayload
): Promise<RequestLoginCodeResponse> => {
  try {
    const response = await axiosInstance.post<RequestLoginCodeResponse>(
      REQUEST_LOGIN_CODE,
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
