import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ReconnectDatasourceResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { RECONNECT_DATASOURCE },
} = API_ENDPOINTS;

export const reconnectDatasource = async (id: string): Promise<ReconnectDatasourceResponse> => {
  try {
    const response = await axiosInstance.post<ReconnectDatasourceResponse>(
      RECONNECT_DATASOURCE.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to reconnect datasource");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
