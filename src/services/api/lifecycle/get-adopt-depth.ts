import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface AdoptDepthBandDto {
  features: number;
  customers: number;
  stillActive: number;
  stillActiveShare: number | null;
}

export interface AdoptDepthData {
  bands: AdoptDepthBandDto[];
  /** Median, deliberately not a mean — one power user would drag a mean nowhere real. */
  medianFeatures: number | null;
  /** Correlation, not causation — see this endpoint's callouts. Good for finding which features
   * stayers reach and leavers never do, not for proving feature use causes retention. */
  lift: number | null;
  windowDays: number;
  activeWithinDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAdoptDepthResponse {
  data: AdoptDepthData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ADOPT_DEPTH },
} = API_ENDPOINTS;

export const getAdoptDepth = async (): Promise<GetAdoptDepthResponse> => {
  try {
    const response = await axiosInstance.get<GetAdoptDepthResponse>(GET_ADOPT_DEPTH);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Adopt's depth");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
