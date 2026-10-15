import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageCalculationDto,
  LeakageCoverageDto,
  LeakageHorizonDto,
  LeakageMeasuredValueDto,
  LeakageSeverityLevelDto,
  LeakageWindowDto,
} from "@/services/api/leakage/get-leakage";

// Confirmed live 2026-09-24 (first populated `markets[]` this endpoint has produced) —
// `gross`/`realized`/`expected`/`net` on the per-market entry, `expected` on each condition, and
// `expected`/`net` on each horizon row are all the same `LeakageMeasuredValueDto<number>` wrapper
// the rest of this API family uses, not the plain nullable number the endpoint's prose implied.
// `gross` on a condition/top-leak stays a plain number, matching the grid cell's own `amount`.
export interface LeakageReportConditionDto {
  key: string;
  label: string;
  gross: number;
  severity: LeakageSeverityLevelDto;
  expected: LeakageMeasuredValueDto<number>;
}

export interface LeakageReportSeverityBandDto {
  level: string;
  label: string;
  cells: number;
  amount: number;
}

export interface LeakageReportHorizonRowDto {
  key: string;
  label: string;
  days: number;
  mode: string;
  expected: LeakageMeasuredValueDto<number>;
  net: LeakageMeasuredValueDto<number>;
}

// `owner`/`roomId`/`severity` confirmed live 2026-09-24 — the original truncated paste cut every
// row off after `net`, so these three were undocumented guesses until now. `owner` is a plain
// string (e.g. "Marketing"), not a nested person object; both are nullable in practice (segment
// grid leaks with no room open had `owner: null`).
export interface LeakageTopLeakDto {
  rank: number;
  grid: string;
  rowKey: string;
  rowLabel: string;
  conditionKey: string;
  conditionLabel: string;
  label: string;
  gross: number;
  expected: LeakageMeasuredValueDto<number>;
  net: LeakageMeasuredValueDto<number>;
  severity: LeakageSeverityLevelDto;
  owner: string | null;
  roomId: string | null;
}

export interface LeakageReportActionsDto {
  openRooms: number;
  owners: string[];
}

export interface LeakageReportMarketDto {
  currency: string;
  countryCode: string | null;
  isPrimary: boolean;
  gross: LeakageMeasuredValueDto<number>;
  realized: LeakageMeasuredValueDto<number>;
  expected: LeakageMeasuredValueDto<number>;
  net: LeakageMeasuredValueDto<number>;
  conditions: LeakageReportConditionDto[];
  excludes: string[];
  bySeverity: LeakageReportSeverityBandDto[];
  byHorizon: LeakageReportHorizonRowDto[];
  topLeaks: LeakageTopLeakDto[];
  actions: LeakageReportActionsDto;
}

export interface LeakageReportData {
  window: LeakageWindowDto;
  horizon: LeakageHorizonDto;
  refreshedAtUtc: string | null;
  coverage: LeakageCoverageDto;
  markets: LeakageReportMarketDto[];
  calculation: LeakageCalculationDto;
}

export interface GetLeakageReportParams {
  window?: string | number;
  horizon?: string | number;
}

export interface GetLeakageReportResponse {
  data: LeakageReportData;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_REPORT },
} = API_ENDPOINTS;

export const getLeakageReport = async (
  params?: GetLeakageReportParams
): Promise<GetLeakageReportResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageReportResponse>(GET_LEAKAGE_REPORT, {
      params,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the leakage report");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
