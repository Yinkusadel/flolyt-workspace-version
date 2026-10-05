import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DatasourceConnectionFieldDto {
  fieldName: string;
  displayName: string;
  fieldType: string;
  placeholder: string | null;
  helpText: string | null;
}

export interface DatasourceConnectionSchemaDto {
  datasourceName: string;
  displayName: string;
  authenticationType: string;
  requiredFields: DatasourceConnectionFieldDto[];
  optionalFields: DatasourceConnectionFieldDto[];
}

export interface GetDatasourceConnectionSchemaResponse {
  data: DatasourceConnectionSchemaDto;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { GET_DATASOURCE_CONNECTION_SCHEMA },
} = API_ENDPOINTS;

export const getDatasourceConnectionSchema = async (
  name: string
): Promise<GetDatasourceConnectionSchemaResponse> => {
  try {
    const response = await axiosInstance.get<GetDatasourceConnectionSchemaResponse>(
      GET_DATASOURCE_CONNECTION_SCHEMA.replace("{name}", name)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch datasource connection schema");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
