import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface StageAttemptMeasurementDto {
  holdoutPercent: number | null;
  noHoldoutBecause: string | null;
  measuredOverDays: number;
  primaryMeasure: string;
  revenueBasis: string;
  contacted: number | null;
  heldBack: number | null;
  liftPoints: number | null;
  recovered: number | null;
}

export interface StageAttemptDto {
  roomId: string;
  title: string;
  decision: string | null;
  condition: string;
  openedAtUtc: string;
  closedAtUtc: string | null;
  status: string;
  outcomeKind: string | null;
  outcomeNote: string | null;
  delta: number | null;
  currency: string;
  howMeasured: StageAttemptMeasurementDto;
  /** validated | observation | constraint | superseded | rejected | room-open */
  learningState: string;
}

export interface StageLearningDto {
  claimId: string;
  statement: string;
  grade: string;
  type: string;
  learningState: string;
  recordedAtUtc: string;
  roomId: string | null;
}

export interface StageHistoryData {
  stageKey: string;
  stageName: string;
  attempts: StageAttemptDto[];
  /** Every claim scoped to the stage or learned in one of its rooms — superseded/rejected included. */
  learnings: StageLearningDto[];
  /** Permanently unavailable — the spec states plainly "nothing models goals yet." Not a wiring
   * gap: don't fetch this expecting it to resolve, comment it out per the backend-gap convention
   * if a screen calls for a "goals depending on this stage" table. */
  goalDependencies: null;
  callouts: LifecycleCalloutDto[];
}

export interface GetStageHistoryResponse {
  data: StageHistoryData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_HISTORY },
} = API_ENDPOINTS;

export const getStageHistory = async (stageKey: string): Promise<GetStageHistoryResponse> => {
  try {
    const response = await axiosInstance.get<GetStageHistoryResponse>(
      GET_STAGE_HISTORY.replace("{stageKey}", stageKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's history");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
