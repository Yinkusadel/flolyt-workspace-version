import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateRoomViewFilterInput {
  query?: string;
  state?: string;
  currency?: string;
  stage?: string;
  condition?: string;
  owner?: string;
  minAmountAtRisk?: number;
  includeArchived?: boolean;
}

export interface CreateRoomViewPayload {
  name: string;
  filter: CreateRoomViewFilterInput;
  sharedWithTeam?: boolean;
}

export interface CreateRoomViewResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_ROOM_VIEW },
} = API_ENDPOINTS;

export const createRoomView = async (
  payload: CreateRoomViewPayload
): Promise<CreateRoomViewResponse> => {
  try {
    const response = await axiosInstance.post<CreateRoomViewResponse>(
      CREATE_ROOM_VIEW,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to save the view");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
