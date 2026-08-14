import axios from "axios";
import { API_ENDPOINTS } from "@//config/apiConfig";

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
    const response = await axios.patch<ResendOtpResponse>(RESEND_OTP, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to resend OTP");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
