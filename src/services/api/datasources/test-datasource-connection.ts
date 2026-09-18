import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface TestDatasourceConnectionPayload {
  datasourceName: string;
  configuration: Record<string, unknown>;
}

export interface TestDatasourceConnectionResultDto {
  isSuccessful: boolean;
  errorMessage: string | null;
  serverVersion: string | null;
}

export interface TestDatasourceConnectionResponse {
  data: TestDatasourceConnectionResultDto;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { TEST_DATASOURCE_CONNECTION },
} = API_ENDPOINTS;

export const testDatasourceConnection = async (
  payload: TestDatasourceConnectionPayload
): Promise<TestDatasourceConnectionResponse> => {
  try {
    const response = await axiosInstance.post<TestDatasourceConnectionResponse>(
      TEST_DATASOURCE_CONNECTION,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to test datasource connection");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
