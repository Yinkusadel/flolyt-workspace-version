import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RemoveTeamMemberParams {
  memberId: string;
  stepUpChallengeId?: string | null;
}

export interface RemoveTeamMemberResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { REMOVE_TEAM_MEMBER },
} = API_ENDPOINTS;

export const removeTeamMember = async ({
  memberId,
  stepUpChallengeId,
}: RemoveTeamMemberParams): Promise<RemoveTeamMemberResponse> => {
  try {
    const response = await axiosInstance.delete<RemoveTeamMemberResponse>(
      REMOVE_TEAM_MEMBER.replace("{memberId}", memberId),
      { params: stepUpChallengeId ? { stepUpChallengeId } : undefined }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to remove team member");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
