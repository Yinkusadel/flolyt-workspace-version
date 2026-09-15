import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface TriggerDatasourceSyncResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { TRIGGER_DATASOURCE_SYNC },
} = API_ENDPOINTS;

export const triggerDatasourceSync = async (
  id: string
): Promise<TriggerDatasourceSyncResponse> => {
  try {
    const response = await axiosInstance.post<TriggerDatasourceSyncResponse>(
      TRIGGER_DATASOURCE_SYNC.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to trigger datasource sync");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
