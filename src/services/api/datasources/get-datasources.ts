import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DatasourceDto {
  id: number;
  name: string;
  displayName: string;
  description: string;
  category: string;
  supportsBulkSync: boolean;
}

export interface GetDatasourcesResponse {
  data: DatasourceDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { GET_DATASOURCES },
} = API_ENDPOINTS;

export const getDatasources = async (): Promise<GetDatasourcesResponse> => {
  try {
    const response = await axiosInstance.get<GetDatasourcesResponse>(GET_DATASOURCES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch datasources");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
