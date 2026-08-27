import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// null clears that field's override back to the global default. Negative or zero
// warnCustomersDeletableThreshold disables the warning entirely.
export interface UpdateDatasourceDeletionConfigPayload {
  deletionBatchSize: number | string | null;
  warnCustomersDeletableThreshold: number | string | null;
}

export interface UpdateDatasourceDeletionConfigResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { UPDATE_DATASOURCE_DELETION_CONFIG },
} = API_ENDPOINTS;

export const updateDatasourceDeletionConfig = async (
  payload: UpdateDatasourceDeletionConfigPayload
): Promise<UpdateDatasourceDeletionConfigResponse> => {
  try {
    const response = await axiosInstance.put<UpdateDatasourceDeletionConfigResponse>(
      UPDATE_DATASOURCE_DELETION_CONFIG,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update deletion config");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
