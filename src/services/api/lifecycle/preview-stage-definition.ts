import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { StageExclusionDto, StageExitRuleDto } from "@/services/api/lifecycle/get-stage-definition";

export interface PreviewStageDefinitionPayload {
  stageKey: string;
  entryEventKey: string;
  exitRules: StageExitRuleDto[] | null;
  exclusions: StageExclusionDto[] | null;
}

// Same { measured, items, unmeasuredReason } shape backs figuresAffected/cohortsBroken/
// goalsInvalidated/learningsScoped per the real spec's example.
export interface PreviewImpactSectionDto {
  measured: boolean;
  items: string[];
  unmeasuredReason: string | null;
}

export interface PreviewStageDefinitionData {
  previewToken: string;
  expiresAtUtc: string;
  stageKey: string;
  wouldBeVersion: number;
  customersAdded: number | null;
  customersRemoved: number | null;
  figuresAffected: PreviewImpactSectionDto;
  cohortsBroken: PreviewImpactSectionDto;
  goalsInvalidated: PreviewImpactSectionDto;
  learningsScoped: PreviewImpactSectionDto;
}

export interface PreviewStageDefinitionResponse {
  data: PreviewStageDefinitionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { PREVIEW_STAGE_DEFINITION },
} = API_ENDPOINTS;

// Only the stage's owner or a workspace administrator can call this.
export const previewStageDefinition = async ({
  stageKey,
  entryEventKey,
  exitRules,
  exclusions,
}: PreviewStageDefinitionPayload): Promise<PreviewStageDefinitionResponse> => {
  try {
    const response = await axiosInstance.post<PreviewStageDefinitionResponse>(
      PREVIEW_STAGE_DEFINITION.replace("{stageKey}", stageKey),
      { entryEventKey, exitRules, exclusions },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to preview the stage definition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
