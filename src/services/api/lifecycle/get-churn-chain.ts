import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";
import type { StageChangeEffectDto } from "@/services/api/lifecycle/get-stage-change-registry";
import type { CurrencyAmountDto } from "@/services/api/lifecycle/get-retain-segments";

export interface ChurnChainCalledItDto {
  kind: string;
  /** What that desk called it at the time, verbatim — deliberately never normalised. */
  words: string;
  atUtc: string;
  reference: string;
}

export interface ChurnChainStageDto {
  stageKey: string;
  stageName: string;
  owningTeam: string | null;
  symptom: string | null;
  effect: StageChangeEffectDto;
  calledIt: ChurnChainCalledItDto;
  daysToDetect: number | null;
  valueAtStake: CurrencyAmountDto[];
  owner: string | null;
}

export interface ChurnChainData {
  changeId: string;
  title: string;
  occurredOnUtc: string;
  team: string | null;
  kind: string;
  affectedStageKeys: string[];
  /** Always all 10 stages, including the ones that did NOT move. */
  stages: ChurnChainStageDto[];
  stagesThatMoved: number;
  stagesThatNoticed: number;
  slowestDetectionDays: number | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetChurnChainResponse {
  data: ChurnChainData;
  messages: string[];
  succeeded: boolean;
}

export interface GetChurnChainParams {
  /** Optional — omit it and the product picks the change whose effects reached the most stages. */
  changeId?: string;
}

const {
  LIFECYCLE: { GET_CHURN_CHAIN },
} = API_ENDPOINTS;

// 404 if changeId doesn't resolve; refuses separately when nothing has moved at least 2 stages.
export const getChurnChain = async (params?: GetChurnChainParams): Promise<GetChurnChainResponse> => {
  try {
    const response = await axiosInstance.get<GetChurnChainResponse>(GET_CHURN_CHAIN, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Churn's chain");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
