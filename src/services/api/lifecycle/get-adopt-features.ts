import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface AdoptFeatureDto {
  feature: string;
  /** Counted in customers, never events. */
  customers: number;
  /** Used more than once. Not a complement of abandonedCustomers — both can be true of one person. */
  returned: number;
  abandonedCustomers: number;
  /** Confirmed 2026-09-05 live: a measured value, not a bare number. */
  kept: LifecycleMeasuredValueDto<number>;
  abandoned: LifecycleMeasuredValueDto<number>;
}

export interface AdoptFeaturesData {
  features: AdoptFeatureDto[];
  /** Confirmed 2026-09-05 live: a measured value, not a bare number. */
  customersSeen: LifecycleMeasuredValueDto<number>;
  windowDays: number;
  abandonedAfterDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAdoptFeaturesResponse {
  data: AdoptFeaturesData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ADOPT_FEATURES },
} = API_ENDPOINTS;

export const getAdoptFeatures = async (): Promise<GetAdoptFeaturesResponse> => {
  try {
    const response = await axiosInstance.get<GetAdoptFeaturesResponse>(GET_ADOPT_FEATURES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Adopt's features");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
