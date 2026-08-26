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
