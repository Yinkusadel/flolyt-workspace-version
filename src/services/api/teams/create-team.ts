import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateTeamPayload {
  name: string;
  description: string | null;
}

export interface CreateTeamResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { CREATE_TEAM },
} = API_ENDPOINTS;

export const createTeam = async (payload: CreateTeamPayload): Promise<CreateTeamResponse> => {
  try {
    const response = await axiosInstance.post<CreateTeamResponse>(CREATE_TEAM, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to create team");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
