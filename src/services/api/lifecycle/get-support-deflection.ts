import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface SupportDeflectionTopicDto {
  topic: string;
  readers: number;
  /** This counts help that FAILED, not help that worked — who read help and raised a ticket anyway. */
  contacted: number;
  contactedAnyway: number | null;
}

export interface SupportDeflectionData {
  topics: SupportDeflectionTopicDto[];
  grain: string | null;
  readings: number | null;
  contactedAnyway: number | null;
  contactWindowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetSupportDeflectionResponse {
  data: SupportDeflectionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_SUPPORT_DEFLECTION },
} = API_ENDPOINTS;

// Needs BOTH product events (help reading) and a helpdesk (tickets) — refuses entirely with
// either missing, since the question is about the relationship between the two.
export const getSupportDeflection = async (): Promise<GetSupportDeflectionResponse> => {
  try {
    const response = await axiosInstance.get<GetSupportDeflectionResponse>(GET_SUPPORT_DEFLECTION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Support's deflection");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
