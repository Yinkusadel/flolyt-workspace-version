import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetRoomsParams {
  /** Default false — open only unless this or an explicit `state` is set. */
  includeArchived?: boolean;
  q?: string;
  state?: string;
  currency?: string;
  stage?: string;
  condition?: string;
  owner?: string;
  minAmountAtRisk?: number;
}

export interface RoomListRestrictedDto {
  reason: string;
  restrictedBy: string;
  restrictedAtUtc: string;
  peopleInside: number;
}

export interface RoomListAgentDto {
  key: string;
  displayName: string;
  role: string;
}

export interface RoomListRowDto {
  id: string;
  title: string;
  conversationId: string | null;
  grid: string;
  stage: string;
  stageLabel: string;
  condition: string;
  conditionLabel: string;
  currency: string;
  population: number | null;
  amountAtRiskAtOpen: number | null;
  currentAmountAtRisk: number | null;
  ownerMemberId: string | null;
  status: string;
  createdAtUtc: string;
  archivedAtUtc: string | null;
  openingNumber: number;
  isRecovering: boolean;
  outcomeKind: string | null;
  restricted: RoomListRestrictedDto | null;
  mergedIntoRoomId: string | null;
  absorbedRoomIds: string[];
  lastActivityAtUtc: string | null;
  stoppedBecause: string | null;
  isStale: boolean;
  /** Null when unowned. On a restricted room this is null. */
  ownerName: string | null;
  /** Empty on a restricted room. */
  agents: RoomListAgentDto[];
  /** Pending plays on the room, counted the way the inbox counts them. 0 on a restricted room. */
  pendingDecisions: number;
  /** True when one of the plays waits on the caller specifically. False on a restricted room. */
  needsYou: boolean;
}

export interface RoomListAmountBehindStaleDto {
  currency: string;
  amount: number;
}

export interface RoomsListData {
  rooms: RoomListRowDto[];
  total: number;
  open: number;
  recovering: number;
  stale: number;
  archived: number;
  amountBehindStale: RoomListAmountBehindStaleDto[];
}

export interface GetRoomsResponse {
  data: RoomsListData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOMS },
} = API_ENDPOINTS;

export const getRooms = async (params?: GetRoomsParams): Promise<GetRoomsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomsResponse>(GET_ROOMS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch rooms");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
