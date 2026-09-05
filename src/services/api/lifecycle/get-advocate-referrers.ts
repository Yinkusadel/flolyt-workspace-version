import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface AdvocateReferrerBandDto {
  referrals: number;
  referrers: number;
  lapsed: number;
  lapsedShare: number | null;
}

export interface AdvocateReferrersData {
  /** Counted in advocates, not referrals — one person who brought 9 referrals is one advocate. */
  bands: AdvocateReferrerBandDto[];
  referrers: number | null;
  referred: number | null;
  lapsed: number | null;
  /** Share of referrals from the busiest decile — an approximation, not a precise figure. */
  concentration: number | null;
  windowDays: number;
  lapsedAfterDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAdvocateReferrersResponse {
  data: AdvocateReferrersData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ADVOCATE_REFERRERS },
} = API_ENDPOINTS;

export const getAdvocateReferrers = async (): Promise<GetAdvocateReferrersResponse> => {
  try {
    const response = await axiosInstance.get<GetAdvocateReferrersResponse>(GET_ADVOCATE_REFERRERS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Advocate's referrers");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
