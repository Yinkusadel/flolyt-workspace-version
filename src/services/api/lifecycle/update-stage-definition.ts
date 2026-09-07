import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { StageExclusionDto, StageExitRuleDto } from "@/services/api/lifecycle/get-stage-definition";

export interface UpdateStageDefinitionPayload {
  stageKey: string;
  previewToken: string;
  entryEventKey: string;
  exitRules: StageExitRuleDto[] | null;
  exclusions: StageExclusionDto[] | null;
}

export interface UpdateStageDefinitionResult {
  stageKey: string;
  version: number;
  supersededVersion: number | null;
  effectiveFromUtc: string;
}

export interface UpdateStageDefinitionResponse {
  data: UpdateStageDefinitionResult;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_STAGE_DEFINITION },
} = API_ENDPOINTS;

// previewToken is single-use and expires 30 min after POST .../definition/preview issued it.
// 409 if the body doesn't match what the token was issued for — surface that as a normal error,
// the caller should re-run the preview rather than retry blindly.
export const updateStageDefinition = async ({
  stageKey,
  previewToken,
  entryEventKey,
  exitRules,
  exclusions,
}: UpdateStageDefinitionPayload): Promise<UpdateStageDefinitionResponse> => {
  try {
    const response = await axiosInstance.put<UpdateStageDefinitionResponse>(
      UPDATE_STAGE_DEFINITION.replace("{stageKey}", stageKey),
      { previewToken, entryEventKey, exitRules, exclusions },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error("STAGE_DEFINITION_TOKEN_MISMATCH");
      }
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to save the stage definition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
