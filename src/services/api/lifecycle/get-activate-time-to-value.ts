import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface TimeToValueBandDto {
  /** same-day | 1-7 | 8-30 | 31+ | never (a real band, not a drop). */
  band: string;
  customers: number;
  share: number | null;
}

export interface ActivateTimeToValueData {
  bands: TimeToValueBandDto[];
  entered: number | null;
  reached: number | null;
  /** A band, not a day count — false precision this doesn't have. */
  medianBand: string | null;
  drift: number | null;
  maturityDays: number;
  /** Whichever exit is bound via PUT .../conversion — the whole screen is unavailable until one is bound. */
  conversionConditionKey: string | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetActivateTimeToValueResponse {
  data: ActivateTimeToValueData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ACTIVATE_TIME_TO_VALUE },
} = API_ENDPOINTS;

export const getActivateTimeToValue = async (): Promise<GetActivateTimeToValueResponse> => {
  try {
    const response = await axiosInstance.get<GetActivateTimeToValueResponse>(GET_ACTIVATE_TIME_TO_VALUE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Activate's time to value");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
