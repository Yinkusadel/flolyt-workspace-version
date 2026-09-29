import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { MappingQualityFlagDto, MappingQualityState } from "@/services/api/workspace/get-mapping-quality";

export interface DataMapTableDto {
  tableName: string;
  rowCount: number;
  mappedTo: string | null;
  mappedColumns: string[];
  confidence: number;
  confidenceBand: "high" | "medium" | "low" | null;
  countsTowardCapability: boolean;
}

export interface DataMapSourceDto {
  datasourceId: string;
  name: string;
  type: string;
  connectionStatus: string;
  isReading: boolean;
  lastSyncedAt: string | null;
  tables: DataMapTableDto[];
}

export interface DataMapSummaryDto {
  sourceCount: number;
  analysedSourceCount: number;
  tableCount: number;
  mappedTableCount: number;
  unmappedTableCount: number;
  lowConfidenceTableCount: number;
  uncountedTableCount: number;
  totalRows: number;
  entitiesCovered: string[];
  entitiesMissing: string[];
}

export interface DataMapDto {
  state: MappingQualityState;
  sources: DataMapSourceDto[];
  summary: DataMapSummaryDto;
  flags: MappingQualityFlagDto[];
  reviewedAtUtc: string | null;
}

export interface GetDataMapResponse {
  data: DataMapDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_DATA_MAP },
} = API_ENDPOINTS;

export const getDataMap = async (): Promise<GetDataMapResponse> => {
  try {
    const response = await axiosInstance.get<GetDataMapResponse>(GET_DATA_MAP);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch data map");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
