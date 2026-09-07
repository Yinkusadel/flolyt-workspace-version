import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DatasourceSyncStatusDto {
  datasourceId: string;
  datasourceName: string;
  architecture: string;
  targetSchemaName: string | null;
  lastSyncedOn: string | null;
  lastSyncRecordCount: number | null;
  lastSyncError: string | null;
  isActive: boolean;
}

export interface GetDatasourceSyncStatusResponse {
  data: DatasourceSyncStatusDto;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { GET_DATASOURCE_SYNC_STATUS },
} = API_ENDPOINTS;

export const getDatasourceSyncStatus = async (
  id: string
): Promise<GetDatasourceSyncStatusResponse> => {
  try {
    const response = await axiosInstance.get<GetDatasourceSyncStatusResponse>(
      GET_DATASOURCE_SYNC_STATUS.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch datasource sync status");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
