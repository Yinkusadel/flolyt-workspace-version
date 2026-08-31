import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface StageChangeEffectDto {
  /** measured | no_effect | too_recent | outside_history | not_instrumented — distinct real states, not a fallback chain. */
  status: string;
  delta: number | null;
  percentChange: number | null;
  caveat: string | null;
}

export interface StageChangeRegistryEntryDto {
  id: string;
  occurredOnUtc: string;
  title: string;
  team: string | null;
  source: string;
  affectedStageKeys: string[];
  effect: StageChangeEffectDto;
  sourceRoomId: string | null;
}

export interface StageChangeRegistryData {
  stageKey: string;
  stageName: string;
  entries: StageChangeRegistryEntryDto[];
  callouts: LifecycleCalloutDto[];
}

export interface GetStageChangeRegistryResponse {
  data: StageChangeRegistryData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_CHANGE_REGISTRY },
} = API_ENDPOINTS;

export const getStageChangeRegistry = async (stageKey: string): Promise<GetStageChangeRegistryResponse> => {
  try {
    const response = await axiosInstance.get<GetStageChangeRegistryResponse>(
      GET_STAGE_CHANGE_REGISTRY.replace("{stageKey}", stageKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's change registry");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
