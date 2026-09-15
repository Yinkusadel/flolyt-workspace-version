import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { TeamDto } from "./get-teams";

export interface TeamMemberDto {
  id: string;
  teamId: string;
  userId: string;
  userEmail: string;
  userName: string;
  roles: string[];
  dateAdded: string;
  isActive: boolean;
}

export interface TeamInvitationDto {
  id: string;
  teamId: string;
  email: string;
  roles: string[];
  status: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export interface TeamDetailDto extends TeamDto {
  members: TeamMemberDto[];
  invitations: TeamInvitationDto[];
}

export interface GetTeamByIdResponse {
  data: TeamDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { GET_TEAM_BY_ID },
} = API_ENDPOINTS;

export const getTeamById = async (teamId: string): Promise<GetTeamByIdResponse> => {
  try {
    const response = await axiosInstance.get<GetTeamByIdResponse>(
      GET_TEAM_BY_ID.replace("{teamId}", teamId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch team");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
