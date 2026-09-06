import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ReferralQualityCohortDto {
  cohort: string;
  customers: number;
  ordersPerCustomer: number | null;
}

export interface ReferralQualityByCurrencyDto {
  currency: string;
  referredPerCustomer: number | null;
  otherPerCustomer: number | null;
  lift: number | null;
}

export interface AdvocateReferralQualityData {
  cohorts: ReferralQualityCohortDto[];
  /** The comparison group is "everybody else who bought," not "acquired customers." One per
   * currency, never blended. */
  byCurrency: ReferralQualityByCurrencyDto[];
  orderLift: number | null;
  windowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAdvocateReferralQualityResponse {
  data: AdvocateReferralQualityData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ADVOCATE_REFERRAL_QUALITY },
} = API_ENDPOINTS;

export const getAdvocateReferralQuality = async (): Promise<GetAdvocateReferralQualityResponse> => {
  try {
    const response = await axiosInstance.get<GetAdvocateReferralQualityResponse>(
      GET_ADVOCATE_REFERRAL_QUALITY
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Advocate's referral quality");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
