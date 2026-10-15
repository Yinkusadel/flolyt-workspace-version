import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RoomSegmentRuleInput } from "@/services/api/rooms/estimate-new-room-cohort";

export interface CreateRoomPersonInput {
  userId: string;
  role: string;
  maxApprovalReach: number | null;
}

export interface CreateRoomAgentInput {
  key: string;
  role: string;
  whatItWillDo: string;
  reads: string[] | null;
}

export interface CreateRoomPayload {
  title: string;
  conditionKey: string;
  currency: string;
  rules: RoomSegmentRuleInput[];
  settlesWhen: string[];
  measuredOverDays: number;
  primaryMeasure: string;
  revenueBasis: string;
  holdoutPercent: number | null;
  noHoldoutBecause?: string;
  wouldProveUsWrong: string;
  people: CreateRoomPersonInput[];
  agents: CreateRoomAgentInput[] | null;
  linkToRoomId: string | null;
  linkReason?: string;
  openDespiteOverlapWith: string[];
}

export interface CreateRoomResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_ROOM },
} = API_ENDPOINTS;

// Runs a final duplicate check and can refuse: if most of the cohort is already in a visible
// room, caller must join it, link via linkToRoomId, or acknowledge via openDespiteOverlapWith
// (room ids, not a flag — so acknowledging one overlap doesn't skip past a second unseen one).
export const createRoom = async (payload: CreateRoomPayload): Promise<CreateRoomResponse> => {
  try {
    const response = await axiosInstance.post<CreateRoomResponse>(CREATE_ROOM, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to open the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
