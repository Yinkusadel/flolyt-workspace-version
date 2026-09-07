import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomCloseMeasurementInput {
  contacted: number;
  heldBack: number;
  convertedContacted: number;
  convertedHeldBack: number;
  recovered: number;
  currency: string;
  excluded: number | null;
  excludedReason: string | null;
  windowStartUtc: string;
  windowEndUtc: string;
  source: string | null;
  contactedRate: number | null;
  heldBackRate: number | null;
  liftPoints: number | null;
}

export interface CloseRoomPayload {
  roomId: string;
  kind: string;
  note?: string;
  // ❌ docs/endpoints/rooms.md names this field with no shape given — typed loosely until a live
  // request/response confirms it.
  dissent?: unknown;
  measurement: RoomCloseMeasurementInput | null;
  supersededByRoomId?: string;
  revisitCondition?: string;
  unmeasuredReason?: string;
}

export interface RoomCloseFalsifierDto {
  condition: string;
  thenWhat: string;
  addedAtUtc: string;
  metAtUtc: string | null;
}

export interface RoomCloseDissentDto {
  wording: string;
  by: string;
  recordedAtUtc: string;
  borneOut: boolean | null;
}

export interface RoomCloseResultData {
  kind: string;
  amountAtOpen: number | null;
  amountAtArchive: number | null;
  delta: number | null;
  currency: string;
  populationAtOpen: number | null;
  populationAtArchive: number | null;
  unmeasuredReason: string | null;
  note: string | null;
  measurement: RoomCloseMeasurementInput | null;
  predictions: RoomCloseFalsifierDto[];
  dissent: RoomCloseDissentDto[];
  supersededByRoomId: string | null;
  revisitCondition: string | null;
  measuredAtUtc: string | null;
}

export interface CloseRoomResponse {
  data: RoomCloseResultData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CLOSE_ROOM },
} = API_ENDPOINTS;

// Claiming "money recovered" requires a held-back group; without one, close is refused and
// pointed at "unmeasurable." Every logged objection carries into the outcome verbatim.
export const closeRoom = async ({
  roomId,
  ...payload
}: CloseRoomPayload): Promise<CloseRoomResponse> => {
  try {
    const response = await axiosInstance.post<CloseRoomResponse>(
      CLOSE_ROOM.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to close the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
