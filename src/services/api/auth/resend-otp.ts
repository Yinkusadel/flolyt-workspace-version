import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  USER: { RESEND_OTP },
} = API_ENDPOINTS;

export const resendUserOtp = async (payload: ResendOtpRequest): Promise<ResendOtpResponse> => {
  try {
    const response = await axiosInstance.patch<ResendOtpResponse>(RESEND_OTP, payload);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to resend OTP");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
