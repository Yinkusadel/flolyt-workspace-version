import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface StageExitRuleDto {
  kind: string;
  eventKey: string | null;
  days: number | null;
  movesToStageKey: string;
}

export interface StageExclusionDto {
  kind: string;
  mergeKey: string | null;
}

export interface StageDefinitionVersionDto {
  version: number;
  entryEventKey: string;
  exitRules: StageExitRuleDto[] | null;
  exclusions: StageExclusionDto[] | null;
  effectiveFromUtc: string;
  createdByUserId: string;
  createdBy: string;
  createdAtUtc: string;
}

export interface StageDefinitionHistoryEntryDto {
  version: number;
  createdAtUtc: string;
  createdByUserId: string;
  createdBy: string;
  isCurrent: boolean;
}

export interface StageDefinitionCandidateDto {
  eventKey: string;
  description: string | null;
  datasourceId: string;
  estimatedRows: number;
  /**
   * A measured value, not a bare number — confirmed 2026-09-04 from the spec's own prose
   * ("unavailable until counted, never filled in from estimatedRows"), same wrapper as GET
   * /map's atStake. `estimatedRows` counts rows, not people, and must never substitute for this
   * while it's unavailable.
   */
  population: LifecycleMeasuredValueDto<number>;
}

export interface StageDefinitionData {
  stageKey: string;
  stageName: string;
  canEdit: boolean;
  isDefined: boolean;
  fallbackInUse: boolean;
  fallbackNote: string | null;
  current: StageDefinitionVersionDto | null;
  history: StageDefinitionHistoryEntryDto[];
  candidates: StageDefinitionCandidateDto[];
}

export interface GetStageDefinitionResponse {
  data: StageDefinitionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_DEFINITION },
} = API_ENDPOINTS;

export const getStageDefinition = async (stageKey: string): Promise<GetStageDefinitionResponse> => {
  try {
    const response = await axiosInstance.get<GetStageDefinitionResponse>(
      GET_STAGE_DEFINITION.replace("{stageKey}", stageKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's definition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
