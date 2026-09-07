import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface SupportSilentFailuresData {
  stageKey: string;
  stageName: string;
  /** Every figure here is an upper bound — includes everybody who DID complain too. */
  couldBeSilent: number | null;
  customersInWindow: number | null;
  share: number | null;
  /** Always unavailable — without a helpdesk there's no contact record for a complaint to be absent from. */
  confirmedSilent: number | null;
  windowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetSupportSilentFailuresResponse {
  data: SupportSilentFailuresData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_SUPPORT_SILENT_FAILURES },
} = API_ENDPOINTS;

export const getSupportSilentFailures = async (): Promise<GetSupportSilentFailuresResponse> => {
  try {
    const response = await axiosInstance.get<GetSupportSilentFailuresResponse>(GET_SUPPORT_SILENT_FAILURES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Support's silent failures");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
