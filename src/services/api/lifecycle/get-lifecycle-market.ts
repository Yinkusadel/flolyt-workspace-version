import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleMapData } from "@/services/api/lifecycle/get-lifecycle-map";

export interface GetLifecycleMarketResponse {
  data: LifecycleMapData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_MARKET },
} = API_ENDPOINTS;

export const getLifecycleMarket = async (country: string): Promise<GetLifecycleMarketResponse> => {
  try {
    const response = await axiosInstance.get<GetLifecycleMarketResponse>(
      GET_MARKET.replace("{country}", country)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the lifecycle map for this market");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
