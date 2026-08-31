import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface StageDepartureClaimDto {
  statement: string;
  grade: string;
  confidence: number;
}

export interface StageDepartureDto {
  cause: string;
  toStageKey: string | null;
  toStageName: string | null;
  conditionKey: string | null;
  size: number | null;
  observedValue: number | null;
  observedValueCaveat: string | null;
  reachability: string | null;
  reachabilityCaveat: string | null;
  claim: StageDepartureClaimDto;
  roomOpen: boolean;
}

export interface StageData {
  stageKey: string;
  stageName: string;
  position: number;
  owningTeam: string | null;
  leadAgentKey: string | null;
  leadAgentName: string | null;
  reviewCadence: string | null;
  population: number | null;
  populationSource: string | null;
  definitionVersion: number | null;
  populationComputedAtUtc: string | null;
  populationCaveat: string | null;
  rateOfChange: number | null;
  primaryConversion: number | null;
  departures: StageDepartureDto[];
  restating: boolean;
  callouts: LifecycleCalloutDto[];
}

export interface GetStageResponse {
  data: StageData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE },
} = API_ENDPOINTS;

export const getStage = async (stageKey: string): Promise<GetStageResponse> => {
  try {
    const response = await axiosInstance.get<GetStageResponse>(GET_STAGE.replace("{stageKey}", stageKey));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
