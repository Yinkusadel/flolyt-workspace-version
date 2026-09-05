import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomDecisionRevisionDto {
  number: number;
  summary: string;
  byUserId: string;
  byLabel: string;
  atUtc: string;
}

export interface RoomDecisionFalsifierDto {
  condition: string;
  thenWhat: string;
  addedAtUtc: string;
  metAtUtc: string | null;
}

export interface RoomDecisionDissentDto {
  id: string;
  wording: string;
  byUserId: string;
  byLabel: string;
  recordedAtUtc: string;
  withdrawn: boolean;
  borneOut: boolean | null;
  aboutProposalId: string | null;
}

export interface RoomDecisionData {
  roomId: string;
  openingNumber: number;
  statement: string | null;
  guardrails: string | null;
  draftedByLabel: string | null;
  decidedByUserId: string | null;
  decidedByLabel: string | null;
  decidedAtUtc: string | null;
  revisions: RoomDecisionRevisionDto[];
  whatWouldChangeThis: RoomDecisionFalsifierDto[];
  dissent: RoomDecisionDissentDto[];
}

export interface GetRoomDecisionResponse {
  data: RoomDecisionData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_DECISION },
} = API_ENDPOINTS;

export const getRoomDecision = async (roomId: string): Promise<GetRoomDecisionResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomDecisionResponse>(
      GET_ROOM_DECISION.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's decision");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
