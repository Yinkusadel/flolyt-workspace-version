import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ConfirmRegistrationPayload {
  userId: string;
  otp: string;
}

export interface ConfirmRegistrationResponse {
  succeeded: boolean;
  messages: string[];
  data: string; // registration id
}

const {
  USER: { CONFIRM_REGISTRATION },
} = API_ENDPOINTS;

export const confirmRegistration = async ({
  userId,
  otp,
}: ConfirmRegistrationPayload): Promise<ConfirmRegistrationResponse> => {
  try {
    const response = await axiosInstance.patch<ConfirmRegistrationResponse>(
      CONFIRM_REGISTRATION.replace("{userId}", userId),
      { otp }
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
