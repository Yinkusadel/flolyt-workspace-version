import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateLifecycleThresholdsPayload {
  activeWithinDays: number;
  slippingWithinDays: number;
  // null on any of these three means "keep the current value" — omitting the key
  // entirely is not the same contract the API expects, so always send the key.
  reactivationDormantDays: number | null;
  repeatCustomerOrders: number | null;
  repeatCustomerWindowDays: number | null;
}

export interface UpdateLifecycleThresholdsResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { UPDATE_LIFECYCLE_THRESHOLDS },
} = API_ENDPOINTS;

export const updateLifecycleThresholds = async (
  payload: UpdateLifecycleThresholdsPayload
): Promise<UpdateLifecycleThresholdsResponse> => {
  try {
    const response = await axiosInstance.put<UpdateLifecycleThresholdsResponse>(
      UPDATE_LIFECYCLE_THRESHOLDS,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update lifecycle thresholds");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
