import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetRoomConflictsParams {
  /** Default true. */
  includeResolved?: boolean;
}

export interface RoomConflictReadingDto {
  key: string;
  label: string;
  recommends: string;
  because: string;
  evidenceClaimIds: string[];
  expectedReach: number | null;
  expectedEffect: number | null;
  currency: string | null;
  effectUnavailableBecause: string | null;
  longRunEffect: string | null;
}

export interface RoomThirdReadingDto {
  question: string;
  askedByUserId: string;
  askedByLabel: string;
  askedAtUtc: string;
  runId: string | null;
}

export interface RoomConflictDto {
  id: string;
  roomId: string;
  summary: string;
  raisedByLabel: string;
  raisedByAgentKey: string | null;
  raisedAtUtc: string;
  // The real response carries more per-reading properties than the doc's example lists (its own
  // entry ends in "...") — don't treat RoomConflictReadingDto as exhaustive.
  readings: RoomConflictReadingDto[];
  waitingOnUserId: string | null;
  escalatedToUserId: string | null;
  escalationReason: string | null;
  escalatedAtUtc: string | null;
  thirdReadings: RoomThirdReadingDto[];
  chosenReadingKey: string | null;
  resolvedByUserId: string | null;
  resolvedByLabel: string | null;
  resolvedAtUtc: string | null;
  resolutionNote: string | null;
  isResolved: boolean;
  comparableEffect: boolean;
}

export interface RoomConflictsData {
  roomId: string;
  conflicts: RoomConflictDto[];
  open: number;
}

export interface GetRoomConflictsResponse {
  data: RoomConflictsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_CONFLICTS },
} = API_ENDPOINTS;

export const getRoomConflicts = async (
  roomId: string,
  params?: GetRoomConflictsParams
): Promise<GetRoomConflictsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomConflictsResponse>(
      GET_ROOM_CONFLICTS.replace("{roomId}", roomId),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's conflicts");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
