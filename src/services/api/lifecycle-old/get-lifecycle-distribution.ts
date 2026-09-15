import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LifecycleStageDistributionDto {
  stage: string;
  customerCount: number;
  lifetimeRevenue: number;
  percentOfBase: number;
}

export interface LifecycleDistributionData {
  totalCustomers: number;
  lifecycleStages: LifecycleStageDistributionDto[];
  businessStages: LifecycleStageDistributionDto[];
  computedAtUtc: string | null;
}

export interface GetLifecycleDistributionResponse {
  data: LifecycleDistributionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_DISTRIBUTION },
} = API_ENDPOINTS;

export const getLifecycleDistribution = async (): Promise<GetLifecycleDistributionResponse> => {
  try {
    const response = await axiosInstance.get<GetLifecycleDistributionResponse>(GET_DISTRIBUTION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the lifecycle distribution");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
