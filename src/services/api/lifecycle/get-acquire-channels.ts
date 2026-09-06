import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface AcquireChannelDto {
  channel: string;
  currency: string | null;
  customers: number | null;
  acquisitionCost: number | null;
  costPerCustomer: number | null;
  buyers: number | null;
  revenue: number | null;
  revenuePerCustomer: number | null;
  /** Unavailable unless cost and revenue share a currency — cost has no currency of its own. */
  return: number | null;
}

export interface AcquireChannelsData {
  /** The two halves (cost vs revenue) refuse separately. */
  channels: AcquireChannelDto[];
  costCurrency: string | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAcquireChannelsResponse {
  data: AcquireChannelsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ACQUIRE_CHANNELS },
} = API_ENDPOINTS;

export const getAcquireChannels = async (): Promise<GetAcquireChannelsResponse> => {
  try {
    const response = await axiosInstance.get<GetAcquireChannelsResponse>(GET_ACQUIRE_CHANNELS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Acquire's channels");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
