import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomGuardrailDto {
  label: string;
  setting: string;
  appliesToThisRoomOnly: boolean;
  setBy: string;
  setByLabel: string | null;
  /** "no" | "by-its-author" — overridable "no" means set elsewhere and changeable there. */
  overridable: string;
  overrideNote: string | null;
  /** Present only when `overridable` is "by-its-author" — a control with nothing to call can't be offered. */
  key: string | null;
  setAtUtc: string | null;
}

export interface RoomGuardrailStoppedDto {
  guardrail: string;
  whatWasStopped: string;
  affected: number | null;
  whatHappenedInstead: string;
}

export interface RoomGuardrailsData {
  roomId: string;
  guardrails: RoomGuardrailDto[];
  stopped: RoomGuardrailStoppedDto[];
  stopsComputedFrom: string | null;
  stopsAbsentBecause: string | null;
  /** Always false today — throughput splits and quiet-hours holds happen during sending and aren't recorded. */
  sendTimeStopsAvailable: boolean;
}

export interface GetRoomGuardrailsResponse {
  data: RoomGuardrailsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_GUARDRAILS },
} = API_ENDPOINTS;

// Overridable "no" guardrails (opt-out, quiet hours, frequency cap) are conditions the send
// pipeline checks and refuses — not permissions an administrator holds. Render as unliftable by
// anyone, including the workspace owner.
export const getRoomGuardrails = async (roomId: string): Promise<GetRoomGuardrailsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomGuardrailsResponse>(
      GET_ROOM_GUARDRAILS.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's guardrails");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
