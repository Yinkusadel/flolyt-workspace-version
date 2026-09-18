import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateTeamLeadPayload {
  team: string;
  leadUserId: string;
}

export interface UpdateTeamLeadResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_TEAM_LEAD },
} = API_ENDPOINTS;

// Administrator only — it decides where other people's alerts land.
export const updateTeamLead = async ({
  team,
  leadUserId,
}: UpdateTeamLeadPayload): Promise<UpdateTeamLeadResponse> => {
  try {
    const response = await axiosInstance.put<UpdateTeamLeadResponse>(
      UPDATE_TEAM_LEAD.replace("{team}", team),
      { leadUserId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the team lead");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
