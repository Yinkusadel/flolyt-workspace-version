import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AcceptInvitationPayload {
  token: string;
  firstName: string;
  lastName: string;
}

export interface AcceptInvitationResponse {
  succeeded: boolean;
  messages: string[];
  data: unknown;
}

const {
  TEAMS: { ACCEPT_INVITATION },
} = API_ENDPOINTS;

export const acceptInvitation = async (
  payload: AcceptInvitationPayload
): Promise<AcceptInvitationResponse> => {
  try {
    const response = await axiosInstance.post<AcceptInvitationResponse>(
      ACCEPT_INVITATION,
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
