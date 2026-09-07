import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ActivateRouteDto {
  route: string;
  customers: number;
  activated: number;
  activationRate: number | null;
  /** A genuine second purchase, not a recency threshold. Unavailable, never zero, with no order stream. */
  repeated: number | null;
  repeatRate: number | null;
}

export interface ActivatePathsData {
  routes: ActivateRouteDto[];
  customers: number | null;
  conversionConditionKey: string | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetActivatePathsResponse {
  data: ActivatePathsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ACTIVATE_PATHS },
} = API_ENDPOINTS;

export const getActivatePaths = async (): Promise<GetActivatePathsResponse> => {
  try {
    const response = await axiosInstance.get<GetActivatePathsResponse>(GET_ACTIVATE_PATHS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Activate's paths");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
