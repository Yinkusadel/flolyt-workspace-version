import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface PauseBandDto {
  /** Includes "never". */
  band: string;
  /** Lapse events, not customers — one person can lapse twice and return once. */
  lapses: number;
  share: number | null;
}

export interface RenewPausesData {
  bands: PauseBandDto[];
  lapses: number | null;
  returned: number | null;
  /** A gap under this many days is a renewal, not a lapse. */
  renewalGraceDays: number;
  maturityDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetRenewPausesResponse {
  data: RenewPausesData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_RENEW_PAUSES },
} = API_ENDPOINTS;

export const getRenewPauses = async (): Promise<GetRenewPausesResponse> => {
  try {
    const response = await axiosInstance.get<GetRenewPausesResponse>(GET_RENEW_PAUSES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Renew's pauses");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
