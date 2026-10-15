import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

/** One step of the investigation. Real response seen 2026-10-13 (kinds `lead`, `coordinate`, `ask`; other kinds read as plain words). */
export interface RoomInvestigationStepDto {
  runId: string;
  agentKey: string | null;
  agentLabel: string | null;
  kind: string;
  /** Set on an `ask` step: the question put to the agent. */
  question: string | null;
  askedByAgentKey: string | null;
  startedAtUtc: string;
  endedAtUtc: string | null;
  outcome: string | null;
  tool: string | null;
}

/**
 * `GET /api/v3/rooms/{roomId}/investigation`. Real response (concluded): `status`, a turn budget with used/left counts, `now` (one line
 * of where it stands), `summary`, `stoppedBecause`, times, `canPause` and the steps. A coordinate/ask step can stay open after its run
 * finished (ticket #57), so a step with no end time is not proof that it is still running.
 */
export interface RoomInvestigationDto {
  roomId: string;
  openingNumber: number;
  status: string;
  turnBudget: number;
  turnsUsed: number;
  turnsLeft: number;
  now: string | null;
  summary: string | null;
  stoppedBecause: string | null;
  startedAtUtc: string | null;
  endedAtUtc: string | null;
  /** ❌ No pause route is documented, so nothing in the UI uses it. */
  canPause: boolean;
  steps: RoomInvestigationStepDto[];
}

export interface GetRoomInvestigationResponse {
  data: RoomInvestigationDto;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_INVESTIGATION },
} = API_ENDPOINTS;

export const getRoomInvestigation = async (roomId: string): Promise<GetRoomInvestigationResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomInvestigationResponse>(GET_ROOM_INVESTIGATION.replace("{roomId}", roomId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // The server's own words matter here: a Room with no lead agent answers 404 "This room has no lead agent, so nothing investigates it."
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's investigation");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
