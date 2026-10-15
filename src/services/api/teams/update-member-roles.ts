import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { UserRole } from "@/validators/teams";

export interface UpdateMemberRolesPayload {
  roles: UserRole[];
  stepUpChallengeId: string | null;
}

export interface UpdateMemberRolesResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { UPDATE_MEMBER_ROLES },
} = API_ENDPOINTS;

// stepUpChallengeId is nullable on the doc but present on this and every other
// role/membership-changing team endpoint, matching the workspace step-up gated
// pattern (see docs/endpoints/workspace.md, [[flolyt_governance_stepup_reminder]]) —
// unconfirmed against the backend, flag before assuming it's optional in practice.
export const updateMemberRoles = async (
  memberId: string,
  payload: UpdateMemberRolesPayload
): Promise<UpdateMemberRolesResponse> => {
  try {
    const response = await axiosInstance.put<UpdateMemberRolesResponse>(
      UPDATE_MEMBER_ROLES.replace("{memberId}", memberId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update member roles");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
