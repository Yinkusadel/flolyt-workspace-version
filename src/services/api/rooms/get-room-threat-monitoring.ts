import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ThreatMonitoringData {
  // ❌ Full `state` enum not shown in the handoff; named values are WORSENED, DATA_DEGRADED and
  // RESOLVED_CANDIDATE. Kept as string until a real payload is seen.
  state: string;
  reason: string | null;
  revision: number;
  notifiedRevision: number | null;
  /** Null (not zero) when DATA_DEGRADED. */
  currentExpectedLoss: number | null;
  /** Signed exposure change from the opening baseline. Never preserved/recovered revenue.
   * Null (not zero) when DATA_DEGRADED. */
  changeFromOpening: number | null;
  currency: string;
  market: string | null;
  lifecycleClass: string | null;
  checkedAtUtc: string;
  /** Show as "awaiting confirmation" when it differs from the accepted `state`. */
  pendingState: string | null;
  pendingReadings: number | null;
  /** Latest 20 immutable updates. ❌ Item shape not shown in the handoff. */
  updates: Record<string, unknown>[];
}

export interface GetRoomThreatMonitoringResponse {
  data: ThreatMonitoringData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_THREAT_MONITORING },
} = API_ENDPOINTS;

// There is no background SSE for this. Refetch while the Room is on screen to discover updates.
// RESOLVED_CANDIDATE still needs independent verification and does not close the Room.
export const getRoomThreatMonitoring = async (roomId: string): Promise<GetRoomThreatMonitoringResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomThreatMonitoringResponse>(GET_ROOM_THREAT_MONITORING.replace("{roomId}", roomId));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch threat monitoring");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
