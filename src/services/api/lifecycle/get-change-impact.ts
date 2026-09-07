import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";
import type { StageChangeEffectDto } from "@/services/api/lifecycle/get-stage-change-registry";

export interface ChangeImpactStageDto {
  stageKey: string;
  stageName: string;
  effect: StageChangeEffectDto;
}

export interface ChangeImpactData {
  changeId: string;
  title: string;
  occurredOnUtc: string;
  team: string | null;
  source: string;
  /** Added 2026-09-04. "action" (default) | "absence_of_action". */
  kind: string;
  affectedStageKeys: string[];
  sourceRoomId: string | null;
  /** Always all 10 stages, in spine order. */
  stages: ChangeImpactStageDto[];
  callouts: LifecycleCalloutDto[];
}

export interface GetChangeImpactResponse {
  data: ChangeImpactData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_CHANGE_IMPACT },
} = API_ENDPOINTS;

export const getChangeImpact = async (changeId: string): Promise<GetChangeImpactResponse> => {
  try {
    const response = await axiosInstance.get<GetChangeImpactResponse>(
      GET_CHANGE_IMPACT.replace("{changeId}", changeId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the change's impact");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
