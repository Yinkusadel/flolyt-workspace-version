import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeleteDatasourceDeletionConfigResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { DELETE_DATASOURCE_DELETION_CONFIG },
} = API_ENDPOINTS;

export const deleteDatasourceDeletionConfig =
  async (): Promise<DeleteDatasourceDeletionConfigResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteDatasourceDeletionConfigResponse>(
        DELETE_DATASOURCE_DELETION_CONFIG
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
        throw new Error(serverMessage || "Failed to remove deletion config override");
      }
      throw new Error(
        "No response from server. Please check your internet connection and try again."
      );
    }
  };
