import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ConnectedDatasourceDto {
  id: string;
  datasourceId: number;
  datasourceName: string;
  datasourceDisplayName: string;
  category: string;
  connectionName: string;
  isActive: boolean;
  connectionStatus: string;
  connectedOn: string;
  disconnectedOn: string | null;
  lastSyncedOn: string | null;
  lastSyncRecordCount: number | null;
  lastSyncError: string | null;
  metadata: Record<string, unknown>;
  architecture: string;
  targetSchemaName: string | null;
}

const {
  DATASOURCES: { GET_CONNECTED_DATASOURCES },
} = API_ENDPOINTS;

// No {data, messages, succeeded} envelope on this one — the documented response is a raw
// array. See docs/endpoints/datasources.md's note before "fixing" this back to the envelope.
export const getConnectedDatasources = async (): Promise<ConnectedDatasourceDto[]> => {
  try {
    const response = await axiosInstance.get<ConnectedDatasourceDto[]>(GET_CONNECTED_DATASOURCES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch connected datasources");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
