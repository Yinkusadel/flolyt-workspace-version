import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface RenewalBookSliceDto {
  /** 0-30 | 31-60 | 61-90 */
  band: string;
  state: string;
  currency: string;
  customers: number;
  value: number | null;
}

export interface RenewalBookData {
  slices: RenewalBookSliceDto[];
  comingUp: number | null;
  /** Certain not to renew — the gap between a raw book count and a real forecast. */
  alreadyCancelled: number | null;
  horizonDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetRenewalBookResponse {
  data: RenewalBookData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_RENEW_RENEWAL_BOOK },
} = API_ENDPOINTS;

export const getRenewalBook = async (): Promise<GetRenewalBookResponse> => {
  try {
    const response = await axiosInstance.get<GetRenewalBookResponse>(GET_RENEW_RENEWAL_BOOK);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Renew's renewal book");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
