import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LifecycleThresholdsDto {
  activeWithinDays: number;
  slippingWithinDays: number;
  reactivationDormantDays: number;
  repeatCustomerOrders: number;
  repeatCustomerWindowDays: number;
  isDefault: boolean;
  updatedAtUtc: string | null;
}

export interface GetLifecycleThresholdsResponse {
  data: LifecycleThresholdsDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_LIFECYCLE_THRESHOLDS },
} = API_ENDPOINTS;

export const getLifecycleThresholds = async (): Promise<GetLifecycleThresholdsResponse> => {
  try {
    const response = await axiosInstance.get<GetLifecycleThresholdsResponse>(
      GET_LIFECYCLE_THRESHOLDS
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch lifecycle thresholds");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
