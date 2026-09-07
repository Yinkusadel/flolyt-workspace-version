import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { TeamInvitationDto } from "./get-team-by-id";

export interface GetTeamInvitationsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface GetTeamInvitationsResponse {
  data: TeamInvitationDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { GET_TEAM_INVITATIONS },
} = API_ENDPOINTS;

export const getTeamInvitations = async (
  teamId: string,
  params?: GetTeamInvitationsParams
): Promise<GetTeamInvitationsResponse> => {
  try {
    const response = await axiosInstance.get<GetTeamInvitationsResponse>(
      GET_TEAM_INVITATIONS.replace("{teamId}", teamId),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch team invitations");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
