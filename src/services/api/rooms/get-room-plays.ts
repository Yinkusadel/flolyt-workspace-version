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
  campaignId: string | null;
}

export interface RoomPlayObligationBlockDto {
  text: string;
  amount: number | null;
  currency: string | null;
  reference: string | null;
}

export interface RoomPlayReturnedObligationDto {
  id: string;
  chainId: string | null;
  roomId: string | null;
  roomTitle: string | null;
  description: string;
  class: string;
  origin: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  toTeam: string | null;
  state: string;
  proposedDueAtUtc: string;
  dueAtUtc: string | null;
  isOverdue: boolean;
  daysOverdue: number | null;
  isPastAskedDate: boolean;
  firstCreatedAtUtc: string;
  askedAtUtc: string;
  acceptedAtUtc: string | null;
  doneAtUtc: string | null;
  lastMovedAtUtc: string;
  blocks: RoomPlayObligationBlockDto[];
  readCount: number;
  repeatCount: number;
  toHasLeft: boolean;
}

export interface RoomPlaysData {
  plays: RoomPlayDto[];
  pending: number;
  done: number;
  rejected: number;
  deferred: number;
  waitingOnPeople: number;
  /** Follow-up obligations (from `close`'s `outstanding`) that landed back at this room/list — the reopen-worthy ones. */
  returnedObligations: RoomPlayReturnedObligationDto[];
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
