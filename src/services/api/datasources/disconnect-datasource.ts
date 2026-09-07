import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DisconnectDatasourceParams {
  id: string;
  // Pass deleteCustomers=true AND confirm=<datasource display name> to also hard-delete
  // customers exclusively imported from this datasource; multi-source customers are preserved.
  deleteCustomers?: boolean;
  confirm?: string;
}

export interface DisconnectDatasourceResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { DISCONNECT_DATASOURCE },
} = API_ENDPOINTS;

export const disconnectDatasource = async ({
  id,
  deleteCustomers,
  confirm,
}: DisconnectDatasourceParams): Promise<DisconnectDatasourceResponse> => {
  try {
    const response = await axiosInstance.post<DisconnectDatasourceResponse>(
      DISCONNECT_DATASOURCE.replace("{id}", id),
      undefined,
      { params: { deleteCustomers, confirm } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to disconnect datasource");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
