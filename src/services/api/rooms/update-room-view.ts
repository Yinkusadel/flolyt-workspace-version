import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { CreateRoomViewFilterInput } from "@/services/api/rooms/create-room-view";

export interface UpdateRoomViewPayload {
  viewId: string;
  name: string;
  filter: CreateRoomViewFilterInput;
  sharedWithTeam?: boolean;
}

export interface UpdateRoomViewResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UPDATE_ROOM_VIEW },
} = API_ENDPOINTS;

// Author only.
export const updateRoomView = async ({
  viewId,
  ...payload
}: UpdateRoomViewPayload): Promise<UpdateRoomViewResponse> => {
  try {
    const response = await axiosInstance.put<UpdateRoomViewResponse>(
      UPDATE_ROOM_VIEW.replace("{viewId}", viewId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the view");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
