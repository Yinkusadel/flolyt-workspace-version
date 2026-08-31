import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeactivateTeamResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { DEACTIVATE_TEAM },
} = API_ENDPOINTS;

export const deactivateTeam = async (teamId: string): Promise<DeactivateTeamResponse> => {
  try {
    const response = await axiosInstance.delete<DeactivateTeamResponse>(
      DEACTIVATE_TEAM.replace("{teamId}", teamId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to deactivate team");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
