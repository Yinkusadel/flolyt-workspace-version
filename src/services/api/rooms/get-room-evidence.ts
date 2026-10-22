import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomEvidenceClaimDto {
  claimId: string;
  statement: string;
  grade: string;
  source: string | null;
  window: string;
  n: number | null;
  missingSource: string | null;
  // ❌ docs/endpoints/rooms.md lists a per-claim "gaps" field alongside the top-level "gaps"
  // array with no shape given for either — typed loosely until a live response confirms it.
  gaps: unknown;
  createdAtUtc: string;
}

export interface RoomEvidenceGapDto {
  missingSource: string;
  claimsBlocked: number;
}

export interface RoomFalsifierDto {
  condition: string;
  thenWhat: string;
  addedAtUtc: string;
  metAtUtc: string | null;
}

export interface RoomEvidenceData {
  roomId: string;
  roomTitle: string;
  totalClaims: number;
  claims: RoomEvidenceClaimDto[];
  gaps: RoomEvidenceGapDto[];
  falsifiers: RoomFalsifierDto[];
}

export interface GetRoomEvidenceResponse {
  data: RoomEvidenceData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_EVIDENCE },
} = API_ENDPOINTS;

export const getRoomEvidence = async (roomId: string): Promise<GetRoomEvidenceResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomEvidenceResponse>(
      GET_ROOM_EVIDENCE.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's evidence");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
