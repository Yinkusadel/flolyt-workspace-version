import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RoomListAgentDto, RoomListRestrictedDto } from "@/services/api/rooms/get-rooms";

export interface RoomConversationPermissionsDto {
  canView: boolean;
  canContribute: boolean;
  canAdminister: boolean;
}

/**
 * One Room (`GET /api/v3/rooms/{roomId}`), real response seen 2026-10-12. The header fields (people, both at-risk
 * figures, owner name, labels, opening number, recovering, threat id, restricted) were added by the backend the
 * same day and carry the same names and values as a `GET /rooms` list row. Core metadata only: not current
 * exposure beyond `currentAmountAtRisk`, and never a verified financial outcome.
 */
export interface RoomDetailDto {
  id: string;
  title: string;
  conversationId: string | null;
  status: string;
  ownerMemberId: string | null;
  /** The caller's role in the Room, e.g. "decision-owner". Null when they have none. */
  viewerRole: string | null;
  createdAtUtc: string;
  archivedAtUtc: string | null;
  stage: string;
  mechanism: string;
  currency: string;
  market: string | null;
  lifecycleClass: string | null;
  leadAgentKey: string | null;
  agents: RoomListAgentDto[];
  mergedIntoRoomId: string | null;
  /** Apply to the Room's conversation only; they grant no approval, management or tool rights. */
  conversationPermissions: RoomConversationPermissionsDto;

  population: number | null;
  amountAtRiskAtOpen: number | null;
  currentAmountAtRisk: number | null;
  currentAmountComputedAtUtc: string | null;
  ownerName: string | null;
  stageLabel: string;
  conditionLabel: string;
  openingNumber: number;
  isRecovering: boolean;
  /** Non-null marks an automatic (system) opening; decides the two threat tabs and "Opened by Flolyt". */
  threatConfirmationId: string | null;
  systemOpenedBy: string | null;
  restricted: RoomListRestrictedDto | null;
}

export interface GetRoomResponse {
  data: RoomDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM },
} = API_ENDPOINTS;

// A missing, foreign or inaccessible Room answers 404 "Room not found." (all three look alike on purpose).
export const getRoom = async (roomId: string): Promise<GetRoomResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomResponse>(GET_ROOM.replace("{roomId}", roomId));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
