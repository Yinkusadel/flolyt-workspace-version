import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SchemaColumnDto {
  columnName: string;
  nativeDataType: string;
  mappedRole: string;
  confidence: number;
  sampleData: unknown;
  flags: string[];
}

export interface SchemaTableDto {
  tableName: string;
  classifiedType: string;
  confidence: number;
  columns: SchemaColumnDto[];
  datasourceType: string;
  clientDatasourceId: string;
  rowCount: number;
  lastSyncedAt: string | null;
}

export interface SchemaExplorerDto {
  tables: SchemaTableDto[];
  totalDatasources: number;
  totalColumns: number;
}

export interface GetSchemaExplorerResponse {
  data: SchemaExplorerDto;
  messages: string[];
  succeeded: boolean;
}

const {
  DATA_PLATFORM: { GET_SCHEMA_EXPLORER },
} = API_ENDPOINTS;

export const getSchemaExplorer = async (): Promise<GetSchemaExplorerResponse> => {
  try {
    const response = await axiosInstance.get<GetSchemaExplorerResponse>(GET_SCHEMA_EXPLORER);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch schema explorer");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
