import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageCalculationDto,
  LeakageCoverageDto,
  LeakageHorizonDto,
  LeakageSeverityLevelDto,
  LeakageWindowDto,
} from "@/services/api/leakage/get-leakage";

export interface LeakageReportConditionDto {
  key: string;
  label: string;
  gross: number;
  severity: LeakageSeverityLevelDto;
  expected: number | null;
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
  expected: number | null;
  net: number | null;
}

// The pasted example truncates each row after `net` (`"...": "[Additional Properties
// Truncated]"`) — the endpoint's own prose says each leak carries "its owner", but the field
// name for that isn't visible in the capture. Re-paste with Scalar's "Show Schema" toggle to add
// it rather than guessing the key.
export interface LeakageTopLeakDto {
  rank: number;
  grid: string;
  rowKey: string;
  rowLabel: string;
  conditionKey: string;
  conditionLabel: string;
  label: string;
  gross: number;
  expected: number | null;
  net: number | null;
}

export interface LeakageReportActionsDto {
  openRooms: number;
  owners: string[];
}

export interface LeakageReportMarketDto {
  currency: string;
  countryCode: string | null;
  isPrimary: boolean;
  gross: number | null;
  realized: number | null;
  expected: number | null;
  net: number | null;
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
