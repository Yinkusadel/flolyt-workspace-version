import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ConnectDatasourcePayload {
  datasourceName: string;
  connectionName: string;
  configuration: Record<string, unknown>;
}

export interface ConnectDatasourceResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { CONNECT_DATASOURCE },
} = API_ENDPOINTS;

export const connectDatasource = async (
  payload: ConnectDatasourcePayload
): Promise<ConnectDatasourceResponse> => {
  try {
    const response = await axiosInstance.post<ConnectDatasourceResponse>(
      CONNECT_DATASOURCE,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to connect datasource");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
