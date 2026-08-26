import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateWorkspacePayload {
  name: string;
  description: string;
  phoneNumber: string | null;
  email: string;
  jobRole: string;
  employeeCountRange: string;
  location: string;
  city: string;
  state: string;
  zipCode: string | null;
  country: string;
  timeZoneId: string;
  currency: string;
  webSite: string | null;
  // Nullable on the API (omit it to claim an address later via PUT /identity
  // instead), but this app always supplies it — the address is collected on
  // this same pre-workspace screen, not on a later onboarding step.
  slug: string;
  // Undocumented beyond the API doc's own curl example, which sends `true` —
  // meaning not confirmed with the backend team yet. See build-plan.md.
  createSeparately: boolean;
}

export interface CreateWorkspaceResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { CREATE_WORKSPACE },
} = API_ENDPOINTS;

export const createWorkspace = async (
  payload: CreateWorkspacePayload
): Promise<CreateWorkspaceResponse> => {
  try {
    const response = await axiosInstance.post<CreateWorkspaceResponse>(CREATE_WORKSPACE, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to create workspace");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
