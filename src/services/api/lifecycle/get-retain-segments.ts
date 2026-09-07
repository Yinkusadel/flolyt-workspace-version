import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface CurrencyAmountDto {
  currency: string;
  amount: number;
}

export interface RetainSegmentClaimDto {
  statement: string;
  grade: string;
  type: string;
  confidence: number;
}

export interface RetainSegmentDto {
  segmentId: string;
  name: string;
  matched: number;
  /** Active, with an address, not suppressed. */
  reachable: number;
  repeating: number;
  decaying: number;
  /** Crossed the boundary and left the stage — counted and marked, never dropped. */
  pastBoundary: number;
  repeatShare: LifecycleMeasuredValueDto<number>;
  reachableShare: LifecycleMeasuredValueDto<number>;
  /** Never summed across currencies. */
  values: CurrencyAmountDto[];
  /** Confirmed 2026-09-05 live: genuinely null (not just an unavailable measured value) when
   * business memory has no claim about this segment yet — a segment can be too new to have one. */
  claim: RetainSegmentClaimDto | null;
  roomOpen: boolean;
}

export interface RetainSegmentOverlapDto {
  segmentA: string;
  nameA: string;
  segmentB: string;
  nameB: string;
  shared: number;
}

export interface RetainSegmentsData {
  stageKey: string;
  stageName: string;
  basis: string;
  basisCaveat: string;
  /** Confirmed 2026-09-05 live: a measured value, not a bare number. */
  retainPopulation: LifecycleMeasuredValueDto<number>;
  segments: RetainSegmentDto[];
  /** A person in two segments is one person — dedup against sumOfMatched. Confirmed 2026-09-05
   * live: a measured value, not a bare number. */
  distinctAcrossSegments: LifecycleMeasuredValueDto<number>;
  sumOfMatched: number;
  distinctValues: CurrencyAmountDto[];
  overlaps: RetainSegmentOverlapDto[];
  valueWindowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetRetainSegmentsResponse {
  data: RetainSegmentsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_RETAIN_SEGMENTS },
} = API_ENDPOINTS;

export const getRetainSegments = async (): Promise<GetRetainSegmentsResponse> => {
  try {
    const response = await axiosInstance.get<GetRetainSegmentsResponse>(GET_RETAIN_SEGMENTS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Retain's segments");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
