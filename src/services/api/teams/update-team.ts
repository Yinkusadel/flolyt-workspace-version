import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateTeamPayload {
  name: string;
  description: string | null;
}

export interface UpdateTeamResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { UPDATE_TEAM },
} = API_ENDPOINTS;

export const updateTeam = async (
  teamId: string,
  payload: UpdateTeamPayload
): Promise<UpdateTeamResponse> => {
  try {
    const response = await axiosInstance.put<UpdateTeamResponse>(
      UPDATE_TEAM.replace("{teamId}", teamId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update team");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
