import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface InstrumentationGapDto {
  gapKey: string;
  name: string;
  gap: string;
  wouldUnlock: string | null;
  blockedStages: string[];
  /** Includes "no-request" — the state of a gap nobody has asked about, alongside a raised request's own lifecycle states. */
  state: string;
  obligationId: string | null;
  requiredEventSchemas: string[];
  blocks: string[];
  requestedAtUtc: string | null;
  neededByUtc: string | null;
  /** Derived, not stored — a stored overdue flag would be wrong every day after the one it was written. */
  daysOverdue: number | null;
  ownerUserId: string | null;
  ownerName: string | null;
}

export interface InstrumentationData {
  /** Derived from the agent roster's readiness, never stored. */
  gaps: InstrumentationGapDto[];
  overdueCount: number;
  unrequestedCount: number;
  callouts: LifecycleCalloutDto[];
}

export interface GetInstrumentationResponse {
  data: InstrumentationData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_INSTRUMENTATION },
} = API_ENDPOINTS;

export const getInstrumentation = async (): Promise<GetInstrumentationResponse> => {
  try {
    const response = await axiosInstance.get<GetInstrumentationResponse>(GET_INSTRUMENTATION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch instrumentation gaps");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
