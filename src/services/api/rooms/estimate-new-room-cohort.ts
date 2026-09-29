import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// `operator` is a fixed backend enum (Equals/NotEquals/GreaterThan/LessThan/
// GreaterThanOrEquals/LessThanOrEquals/Contains/NotContains/IsSet/IsNotSet) — see
// ROOM_RULE_OPERATORS in new-room-data.ts. `field` has no enum in the spec and a live test
// (an unrecognized field string) returned 200 rather than a 400, so it's free text, not picked
// from a vocabulary. `value` accepts null (confirmed live) alongside string/number.
export interface RoomSegmentRuleInput {
  field: string;
  operator: string;
  value: string | number | null;
  logicOperator: string | null;
  order: number;
}

export interface EstimateNewRoomCohortPayload {
  rules: RoomSegmentRuleInput[];
  currency: string;
}

export interface RoomCohortDropOutDto {
  key: string;
  label: string;
  customers: number;
  why: string;
}

export interface NewRoomCohortEstimateData {
  matched: number;
  reachable: number;
  amountAtRisk: number | null;
  currency: string;
  outsideCurrency: number;
  dropOut: RoomCohortDropOutDto[];
  computedAtUtc: string;
}

export interface EstimateNewRoomCohortResponse {
  data: NewRoomCohortEstimateData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { ESTIMATE_NEW_ROOM_COHORT },
} = API_ENDPOINTS;

// `reachable` (not `matched`) is the figure the eventual room carries. `amountAtRisk` is null
// when nobody in the cohort has ordered in this market — null is unpriced, never zero. Nothing
// persisted — abandoning the wizard leaves nothing behind.
export const estimateNewRoomCohort = async (
  payload: EstimateNewRoomCohortPayload
): Promise<EstimateNewRoomCohortResponse> => {
  try {
    const response = await axiosInstance.post<EstimateNewRoomCohortResponse>(
      ESTIMATE_NEW_ROOM_COHORT,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to estimate the cohort");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
