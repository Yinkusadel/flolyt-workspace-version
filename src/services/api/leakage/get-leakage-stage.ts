import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageAtStakeEntryDto,
  LeakageCalculationDto,
  LeakageExpectedEntryDto,
  LeakageHeadlineDto,
  LeakageHorizonDto,
  LeakageMarketLensDto,
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
  marketLens: LeakageMarketLensDto;
  atStake: LeakageAtStakeEntryDto[] | null;
  expected: LeakageExpectedEntryDto[] | null;
  severity: LeakageStageSeverityDto[];
  movement: LeakageMovementDto | null;
  population: number | null;
  /** Per calendar month, not per window — the calculation block says so. */
  departedThisMonth: number | null;
  headline: LeakageHeadlineDto;
  openRoomCount: number;
  /** Empty for the seven stages the customer-state axis doesn't reach — the honest answer, not a gap. */
  spansStates: string[];
  learnWhy: LeakageStageLearnWhyDto;
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
