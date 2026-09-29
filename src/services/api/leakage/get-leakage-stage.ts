import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageAtStakeAmountDto,
  LeakageCalculationDto,
  LeakageExpectedEntryDto,
  LeakageHeadlineDto,
  LeakageHorizonDto,
  LeakageMarketLensDto,
  LeakageMeasuredValueDto,
  LeakageOwnerDto,
  LeakageRealizedAmountDto,
  LeakageStageSeverityDto,
} from "@/services/api/leakage/get-leakage";
import type { LeakageMovementDto } from "@/services/api/leakage/get-leakage-cell";

export interface LeakageStageLearnWhyDto {
  agentKey: string;
  agentName: string;
}

export interface LeakageStageDetailDto {
  key: string;
  name: string;
  position: number;
  owningTeam: string | null;
  owner: LeakageOwnerDto | null;
  reviewCadence: string | null;
  windowDays: number;
  horizon: LeakageHorizonDto;
  // Confirmed live 2026-09-22 to be nullable, same as the page-level field.
  marketLens: LeakageMarketLensDto | null;
  atStake: LeakageMeasuredValueDto<LeakageAtStakeAmountDto[]>;
  expected: LeakageMeasuredValueDto<LeakageExpectedEntryDto[]>;
  severity: LeakageStageSeverityDto[];
  movement: LeakageMovementDto;
  population: LeakageMeasuredValueDto<number>;
  /** Per calendar month, not per window — the calculation block says so. */
  departedThisMonth: LeakageMeasuredValueDto<number>;
  headline: LeakageHeadlineDto;
  openRoomCount: number;
  /** Empty for the seven stages the customer-state axis doesn't reach — the honest answer, not a gap. */
  spansStates: string[];
  /**
   * Null when the stage has no specialist to ask — confirmed live 2026-09-24 on `churn`, the one
   * stage whose page-level entry also carries `leadAgentKey: null` / `leadAgentName: null`. Was
   * typed non-nullable from the doc's example, which only showed a stage that had one; reading
   * `.agentName` off it crashed the whole route when that stage's panel opened.
   */
  learnWhy: LeakageStageLearnWhyDto | null;
  calculation: LeakageCalculationDto;
  refreshedAtUtc: string | null;
  realized: LeakageRealizedAmountDto[];
}

export interface GetLeakageStageParams {
  window?: string | number;
  market?: string;
  horizon?: string | number;
}

export interface GetLeakageStageResponse {
  data: LeakageStageDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_STAGE },
} = API_ENDPOINTS;

export const getLeakageStage = async (
  stageKey: string,
  params?: GetLeakageStageParams
): Promise<GetLeakageStageResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageStageResponse>(
      GET_LEAKAGE_STAGE.replace("{stageKey}", stageKey),
      { params }
    );

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
