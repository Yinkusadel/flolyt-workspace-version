import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LifecycleTeamDto {
  team: string;
  stages: string[];
  /** null is a real, valid answer — alerts fall through to an admin for triage. */
  leadUserId: string | null;
  leadName: string | null;
}

export interface GetLifecycleTeamsResponse {
  /** A bare array, not wrapped under a data object. */
  data: LifecycleTeamDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_TEAMS },
} = API_ENDPOINTS;

export const getLifecycleTeams = async (): Promise<GetLifecycleTeamsResponse> => {
  try {
    const response = await axiosInstance.get<GetLifecycleTeamsResponse>(GET_TEAMS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the lifecycle teams");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
