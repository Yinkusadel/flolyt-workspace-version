import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomLogEntryDto {
  occurredAtUtc: string;
  /** "Human" and "Agent" seen live; the platform's own entries are expected as "System" (none seen yet). */
  actorKind: string;
  actorId: string;
  /** As the backend labels the actor: a person reads "chad@yopmail.com · Administrator" today, an agent "Flolyt". */
  actorLabel: string;
  action: string;
  /** What followed the action, or null (e.g. "Opened the room to the workspace"). */
  consequence: string | null;
  /** The dissent's own words when this entry recorded one, else null. (Real response 2026-10-14: a string, not a flag.) */
  dissent: string | null;
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
