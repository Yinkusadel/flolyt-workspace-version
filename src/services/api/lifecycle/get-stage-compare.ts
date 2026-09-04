import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface GetStageCompareParams {
  /** 1-12, default 3. */
  months?: number;
}

export interface StageCompareWindowDto {
  fromUtc: string;
  toUtc: string;
  monthsInWindow: number;
  monthsMeasured: number;
  endPopulation: number | null;
  averagePopulation: number | null;
  /** Added 2026-09-04. Reads the same primaryConversion binding PUT .../conversion sets, unconfirmed live. */
  endConversion: number | null;
  restatedMonths: number;
}

export interface StageCompareData {
  stageKey: string;
  stageName: string;
  windowMonths: number;
  before: StageCompareWindowDto;
  after: StageCompareWindowDto;
  change: number | null;
  changePercent: number | null;
  /** Added 2026-09-04. */
  conversionChange: number | null;
  definitionChangedInside: boolean;
  callouts: LifecycleCalloutDto[];
}

export interface GetStageCompareResponse {
  data: StageCompareData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_COMPARE },
} = API_ENDPOINTS;

export const getStageCompare = async (
  stageKey: string,
  params?: GetStageCompareParams
): Promise<GetStageCompareResponse> => {
  try {
    const response = await axiosInstance.get<GetStageCompareResponse>(
      GET_STAGE_COMPARE.replace("{stageKey}", stageKey),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's compare window");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
