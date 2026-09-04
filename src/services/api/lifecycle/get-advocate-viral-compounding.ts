import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ViralCompoundingGenerationDto {
  generation: string;
  referrers: number;
  referred: number;
  referredPerReferrer: number | null;
}

export interface AdvocateViralCompoundingData {
  /** Measured, not projected — the observed referral chain only, no forecast. */
  generations: ViralCompoundingGenerationDto[];
  /** Taken over advocates, not over referrals. */
  secondGenerationShare: number | null;
  windowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAdvocateViralCompoundingResponse {
  data: AdvocateViralCompoundingData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ADVOCATE_VIRAL_COMPOUNDING },
} = API_ENDPOINTS;

export const getAdvocateViralCompounding = async (): Promise<GetAdvocateViralCompoundingResponse> => {
  try {
    const response = await axiosInstance.get<GetAdvocateViralCompoundingResponse>(
      GET_ADVOCATE_VIRAL_COMPOUNDING
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Advocate's viral compounding");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
