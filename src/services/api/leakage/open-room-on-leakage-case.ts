import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "opens or returns the linked Room. Supply enough dimensions to select exactly one amount;
// currencies are never converted or combined." Response shape for the Room itself isn't given as a
// literal type in the doc (unlike RevenueLeakCase) — `roomId` is the one field confirmed by name
// elsewhere (`RevenueLeakCase.roomId`); confirm the rest against a real response before relying on
// anything beyond it.

export interface OpenRoomOnLeakageCasePayload {
  caseId: string;
  currency: string;
  market?: string | null;
  lifecycleClass: string;
  mode: string;
  title?: string;
}

export interface OpenRoomOnLeakageCaseResult {
  roomId: string;
  [key: string]: unknown;
}

export interface OpenRoomOnLeakageCaseResponse {
  data: OpenRoomOnLeakageCaseResult;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { OPEN_ROOM_ON_LEAKAGE_CASE },
} = API_ENDPOINTS;

export const openRoomOnLeakageCase = async ({
  caseId,
  currency,
  market,
  lifecycleClass,
  mode,
  title,
}: OpenRoomOnLeakageCasePayload): Promise<OpenRoomOnLeakageCaseResponse> => {
  try {
    const response = await axiosInstance.post<OpenRoomOnLeakageCaseResponse>(
      OPEN_ROOM_ON_LEAKAGE_CASE.replace("{caseId}", caseId),
      { currency, market, lifecycleClass, mode, title },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to open a room on this case");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
