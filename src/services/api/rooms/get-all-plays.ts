import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { GetRoomPlaysParams, RoomPlaysData } from "@/services/api/rooms/get-room-plays";

export type GetAllPlaysParams = GetRoomPlaysParams;

export interface GetAllPlaysResponse {
  data: RoomPlaysData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ALL_PLAYS },
} = API_ENDPOINTS;

// `waitingOnPeople` is how many distinct people the pending plays sit with — surfaces a
// bottleneck when e.g. 14 plays are waiting and 6 sit with one person.
export const getAllPlays = async (params?: GetAllPlaysParams): Promise<GetAllPlaysResponse> => {
  try {
    const response = await axiosInstance.get<GetAllPlaysResponse>(GET_ALL_PLAYS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch plays across all rooms");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
