import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RoomSegmentRuleInput } from "@/services/api/rooms/estimate-new-room-cohort";

export interface GetSimilarRoomsPayload {
  rules: RoomSegmentRuleInput[];
  currency: string;
  limit: number | null;
}

export interface SimilarRoomDto {
  roomId: string;
  title: string;
  population: number | null;
  sharedCustomers: number;
  shareOfCandidate: number | null;
  doubleCountedAmount: number | null;
  currency: string;
  ownerMemberId: string | null;
  ownerName: string | null;
  state: string;
  openedAtUtc: string;
  suggestion: string | null;
}

export interface SimilarRoomsData {
  candidateMatched: number;
  rooms: SimilarRoomDto[];
  restrictedOverlaps: number;
  computedAtUtc: string;
}

export interface GetSimilarRoomsResponse {
  data: SimilarRoomsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_SIMILAR_ROOMS },
} = API_ENDPOINTS;

// Meant to be called repeatedly (at the name, at the audience, before opening). `suggestion` is a
// reading aid only — nothing branches on it.
export const getSimilarRooms = async (
  payload: GetSimilarRoomsPayload
): Promise<GetSimilarRoomsResponse> => {
  try {
    const response = await axiosInstance.post<GetSimilarRoomsResponse>(
      GET_SIMILAR_ROOMS,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to find similar rooms");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
