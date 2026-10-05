import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type MappingQualityState =
  | "nothing_connected"
  | "awaiting_analysis"
  | "clean"
  | "flagged"
  | string;

export interface MappingQualityFlagDto {
  key: string;
  mapping: string;
  consequence: string;
  fix: string | null;
  entity: string;
  isMeasured: boolean;
}

export interface MappingQualityDto {
  state: MappingQualityState;
  flags: MappingQualityFlagDto[];
  contributingSourceCount: number;
  analysedSourceCount: number;
  reviewedAtUtc: string | null;
}

export interface GetMappingQualityResponse {
  data: MappingQualityDto;
  messages: string[];
  succeeded: boolean;
}

const {
  WORKSPACE: { GET_MAPPING_QUALITY },
} = API_ENDPOINTS;

export const getMappingQuality = async (): Promise<GetMappingQualityResponse> => {
  try {
    const response = await axiosInstance.get<GetMappingQualityResponse>(GET_MAPPING_QUALITY);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch mapping quality");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
