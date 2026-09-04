import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface PricePlanDto {
  plan: string;
  currency: string;
  customers: number;
  /** Unavailable, never zero, when the book has no amount mapped — unpriced plans are not free ones. */
  value: number | null;
  valuePerCustomer: number | null;
  shareOfCustomers: number | null;
}

export interface PricePlansData {
  /** Live subscriptions only, one row per plan per currency. */
  plans: PricePlanDto[];
  customers: number | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetPricePlansResponse {
  data: PricePlansData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_PRICE_PLANS },
} = API_ENDPOINTS;

export const getPricePlans = async (): Promise<GetPricePlansResponse> => {
  try {
    const response = await axiosInstance.get<GetPricePlansResponse>(GET_PRICE_PLANS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Price's plans");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
