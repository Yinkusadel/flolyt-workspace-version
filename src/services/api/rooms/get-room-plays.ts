import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetRoomPlaysParams {
  /** Default true. */
  includeDecided?: boolean;
}

export interface RoomPlayDto {
  proposalId: string;
  roomId: string;
  roomTitle: string;
  summary: string;
  toolName: string;
  reach: number | null;
  effect: number | null;
  currency: string | null;
  figuresAreStated: boolean;
  state: string;
  decisionOwnerMemberId: string | null;
  waitingHours: number | null;
  deferredBecause: string | null;
  proposedAtUtc: string;
}

export interface RoomPlaysData {
  plays: RoomPlayDto[];
  pending: number;
  done: number;
  rejected: number;
  deferred: number;
  waitingOnPeople: number;
}

export interface GetRoomPlaysResponse {
  data: RoomPlaysData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_PLAYS },
} = API_ENDPOINTS;

// `figuresAreStated` must be rendered, since a stated reach read as a checked one is how a play
// meant for 100k people reaches 5x that.
export const getRoomPlays = async (
  roomId: string,
  params?: GetRoomPlaysParams
): Promise<GetRoomPlaysResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomPlaysResponse>(
      GET_ROOM_PLAYS.replace("{roomId}", roomId),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's plays");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
