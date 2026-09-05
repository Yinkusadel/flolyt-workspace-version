import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetStageChangesParams {
  /** RFC 3339. Defaults to a 12-month restatement window when omitted. */
  from?: string;
  to?: string;
}

export interface StagePopulationPeriodDto {
  periodStartUtc: string;
  population: number | null;
  /** Unavailable rather than zero whenever either bounding month's population is. */
  delta: number | null;
  isDefinitionChange: boolean;
  isRestated: boolean;
  definitionVersion: number;
  restatedFromVersion: number | null;
  asOfUtc: string;
}

export interface StageChangesData {
  stageKey: string;
  stageName: string;
  restating: boolean;
  periods: StagePopulationPeriodDto[];
}

export interface GetStageChangesResponse {
  data: StageChangesData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_CHANGES },
} = API_ENDPOINTS;

export const getStageChanges = async (
  stageKey: string,
  params?: GetStageChangesParams
): Promise<GetStageChangesResponse> => {
  try {
    const response = await axiosInstance.get<GetStageChangesResponse>(
      GET_STAGE_CHANGES.replace("{stageKey}", stageKey),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's population history");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
