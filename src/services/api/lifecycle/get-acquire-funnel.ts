import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface AcquireFunnelRungDto {
  /** registered | verified | intent | transacted | settled — fixed by Flolyt, not per-tenant. */
  rung: string;
  customers: number | null;
  shareOfRegistered: number | null;
  /** Every rung is counted from registration, never chained off the rung above. */
  shareOfPrevious: number | null;
}

export interface AcquireFunnelMatchedEventDto {
  event: string;
  rung: string;
  occurrences: number;
}

export interface AcquireFunnelData {
  rungs: AcquireFunnelRungDto[];
  registered: number | null;
  /** Which of the workspace's own event names were read as which rung — render it, keyword matching is inference. */
  matched: AcquireFunnelMatchedEventDto[];
  unevidenced: string[];
  maturityDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAcquireFunnelResponse {
  data: AcquireFunnelData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ACQUIRE_FUNNEL },
} = API_ENDPOINTS;

export const getAcquireFunnel = async (): Promise<GetAcquireFunnelResponse> => {
  try {
    const response = await axiosInstance.get<GetAcquireFunnelResponse>(GET_ACQUIRE_FUNNEL);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Acquire's funnel");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
