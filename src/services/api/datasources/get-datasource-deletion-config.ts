import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DatasourceDeletionConfigDto {
  companyId: string;
  warnCustomersDeletableThreshold: number | null;
  deletionBatchSize: number | null;
  effectiveWarnCustomersDeletableThreshold: number;
  effectiveDeletionBatchSize: number;
  lastUpdatedAt: string | null;
}

export interface GetDatasourceDeletionConfigResponse {
  data: DatasourceDeletionConfigDto;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { GET_DATASOURCE_DELETION_CONFIG },
} = API_ENDPOINTS;

export const getDatasourceDeletionConfig =
  async (): Promise<GetDatasourceDeletionConfigResponse> => {
    try {
      const response = await axiosInstance.get<GetDatasourceDeletionConfigResponse>(
        GET_DATASOURCE_DELETION_CONFIG
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
        throw new Error(serverMessage || "Failed to fetch deletion config");
      }
      throw new Error(
        "No response from server. Please check your internet connection and try again."
      );
    }
  };
