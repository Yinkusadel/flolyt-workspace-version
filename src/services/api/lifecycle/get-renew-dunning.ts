import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface DunningBandDto {
  /** within-a-day | within-a-week | later | never (a real band, not an exclusion). */
  band: string;
  customers: number;
  share: number | null;
}

export interface RenewDunningData {
  bands: DunningBandDto[];
  failed: number | null;
  recovered: number | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetRenewDunningResponse {
  data: RenewDunningData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_RENEW_DUNNING },
} = API_ENDPOINTS;

export const getRenewDunning = async (): Promise<GetRenewDunningResponse> => {
  try {
    const response = await axiosInstance.get<GetRenewDunningResponse>(GET_RENEW_DUNNING);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Renew's dunning");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
