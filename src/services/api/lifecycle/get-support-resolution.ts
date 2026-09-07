import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface SupportResolutionBandDto {
  driver: string;
  tickets: number;
  resolved: number;
  open: number;
  averageHours: number | null;
  /** Read alongside averageHours always — the average only covers resolved tickets. */
  resolvedShare: number | null;
}

export interface SupportResolutionData {
  bands: SupportResolutionBandDto[];
  averageHours: number | null;
  resolvedShare: number | null;
  windowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetSupportResolutionResponse {
  data: SupportResolutionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_SUPPORT_RESOLUTION },
} = API_ENDPOINTS;

export const getSupportResolution = async (): Promise<GetSupportResolutionResponse> => {
  try {
    const response = await axiosInstance.get<GetSupportResolutionResponse>(GET_SUPPORT_RESOLUTION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Support's resolution");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
