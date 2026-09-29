import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetRoomRunsParams {
  limit?: number;
}

export interface RoomRunAgentDto {
  key: string;
  displayName: string;
  role: string;
  /** The kit's seven states plus "awaiting-approval" — a run parked on a person, not a machine. */
  state: string;
  currentRunId: string | null;
}

export interface RoomRunDto {
  runId: string;
  agentKey: string | null;
  agentName: string | null;
  startedAtUtc: string;
  finishedAtUtc: string | null;
  turns: number;
  state: string;
  /** Almost always null — runs don't depend on other runs in this system. */
  waitingOn: string | null;
  failedBecause: string | null;
  result: string | null;
  cancelledByUserId: string | null;
  cancelReason: string | null;
}

export interface RoomRunsData {
  roomId: string;
  agents: RoomRunAgentDto[];
  runs: RoomRunDto[];
  noAgentsNamed: boolean;
  /** Always false — nothing counts rows an agent read; render "unavailable", never a zero. */
  rowsReadAvailable: boolean;
}

export interface GetRoomRunsResponse {
  data: RoomRunsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_RUNS },
} = API_ENDPOINTS;

// A failed run is a row like any other — not hidden, not a banner. Its cause is named, which
// makes it fixable, and the room keeps working with one agent blind. Don't sort by severity or
// lift failures into their own section.
export const getRoomRuns = async (
  roomId: string,
  params?: GetRoomRunsParams
): Promise<GetRoomRunsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomRunsResponse>(
      GET_ROOM_RUNS.replace("{roomId}", roomId),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's runs");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
