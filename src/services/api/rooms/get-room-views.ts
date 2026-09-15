import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomViewFilterDto {
  query: string | null;
  state: string | null;
  currency: string | null;
  stage: string | null;
  condition: string | null;
  owner: string | null;
  minAmountAtRisk: number | null;
  includeArchived: boolean;
}

export interface RoomViewDto {
  id: string;
  name: string;
  filter: RoomViewFilterDto;
  sharedWithTeam: boolean;
  mine: boolean;
  createdBy: string;
  createdAtUtc: string;
  roomCount: number;
}

export interface GetRoomViewsResponse {
  data: RoomViewDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_VIEWS },
} = API_ENDPOINTS;

export const getRoomViews = async (): Promise<GetRoomViewsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomViewsResponse>(GET_ROOM_VIEWS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the saved views");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
