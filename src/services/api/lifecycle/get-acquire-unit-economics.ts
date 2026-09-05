import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface UnitEconomicsPointDto {
  month: number;
  cumulativeRevenue: number | null;
  cumulativeMargin: number | null;
}

export interface UnitEconomicsCohortDto {
  cohort: string;
  customers: number;
  monthsObserved: number;
  currency: string;
  acquisitionCost: number | null;
  /** Unavailable, never a payback month, when the cohort hasn't crossed its cost line yet — not-yet is not never. */
  revenuePaybackMonth: number | null;
  marginPaybackMonth: number | null;
  /** Cohorts of different ages are never averaged — this curve is per-cohort, not collapsed to one number. */
  points: UnitEconomicsPointDto[];
}

export interface AcquireUnitEconomicsData {
  cohorts: UnitEconomicsCohortDto[];
  costCurrency: string | null;
  /** Margin is computed only where these cost roles are mapped — never assumed or substituted. */
  costComponents: string[];
  hasMargin: boolean;
  monthsObserved: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetAcquireUnitEconomicsResponse {
  data: AcquireUnitEconomicsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_ACQUIRE_UNIT_ECONOMICS },
} = API_ENDPOINTS;

export const getAcquireUnitEconomics = async (): Promise<GetAcquireUnitEconomicsResponse> => {
  try {
    const response = await axiosInstance.get<GetAcquireUnitEconomicsResponse>(GET_ACQUIRE_UNIT_ECONOMICS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Acquire's unit economics");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
