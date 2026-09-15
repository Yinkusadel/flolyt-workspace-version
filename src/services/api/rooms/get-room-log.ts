import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomLogEntryDto {
  occurredAtUtc: string;
  actorKind: string;
  actorId: string;
  actorLabel: string;
  action: string;
  consequence: string | null;
  dissent: boolean;
}

export interface RoomLogData {
  roomId: string;
  roomTitle: string;
  totalEntries: number;
  humanEntries: number;
  agentEntries: number;
  systemEntries: number;
  entries: RoomLogEntryDto[];
}

export interface GetRoomLogResponse {
  data: RoomLogData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_LOG },
} = API_ENDPOINTS;

export const getRoomLog = async (roomId: string): Promise<GetRoomLogResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomLogResponse>(
      GET_ROOM_LOG.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's log");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
