import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface InvitationDetailsDto {
  id: string;
  teamId: string;
  teamName: string;
  email: string;
  roles: string[];
  inviterName: string;
  expiresAt: string;
  isExpired: boolean;
  userAlreadyExists: boolean;
  requiresRegistration: boolean;
}

export interface GetInvitationDetailsResponse {
  data: InvitationDetailsDto;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { GET_INVITATION_DETAILS },
} = API_ENDPOINTS;

// Unauthenticated — used on the accept-invitation page before the invitee has
// signed in, same as POST /invitations/accept (services/api/auth/accept-invitation.ts).
export const getInvitationDetails = async (
  token: string
): Promise<GetInvitationDetailsResponse> => {
  try {
    const response = await axiosInstance.get<GetInvitationDetailsResponse>(
      GET_INVITATION_DETAILS,
      { params: { token } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch invitation details");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
