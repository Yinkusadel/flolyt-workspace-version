import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DatasourceDisconnectionDto {
  id: string;
  datasourceId: string;
  datasourceDisplayName: string;
  requestedAt: string;
  completedAt: string | null;
  candidateCustomerCount: number;
  actuallyDeletedCount: number;
  multiSourceCustomersPreservedCount: number;
  softCeilingExceeded: boolean;
  error: string | null;
}

export interface GetDatasourceDisconnectionsParams {
  datasourceId?: string;
  from?: string;
  to?: string;
}

export interface GetDatasourceDisconnectionsResponse {
  data: DatasourceDisconnectionDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { GET_DATASOURCE_DISCONNECTIONS },
} = API_ENDPOINTS;

export const getDatasourceDisconnections = async (
  params?: GetDatasourceDisconnectionsParams
): Promise<GetDatasourceDisconnectionsResponse> => {
  try {
    const response = await axiosInstance.get<GetDatasourceDisconnectionsResponse>(
      GET_DATASOURCE_DISCONNECTIONS,
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch datasource disconnections");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
