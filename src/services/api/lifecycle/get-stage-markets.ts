import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface StageMarketDto {
  countryCode: string;
  currencyCode: string;
  isPrimary: boolean;
  // Typed as the measured-value wrapper for consistency with every other occurrence of these
  // field names elsewhere in this domain — the spec's own example just showed bare `null` for
  // all three, same as it does for genuinely-wrapped fields (e.g. GET /map's atStake). Confirm
  // against a live response before trusting this shape.
  population: LifecycleMeasuredValueDto<number>;
  atStake: LifecycleMeasuredValueDto<number>;
  primaryConversion: LifecycleMeasuredValueDto<number>;
}

export interface StageMarketsData {
  stageKey: string;
  stageName: string;
  /** Primary market first, then alphabetical. Never a total row — each row's money is that market's own currency. */
  markets: StageMarketDto[];
  callouts: LifecycleCalloutDto[];
}

export interface GetStageMarketsResponse {
  data: StageMarketsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_MARKETS },
} = API_ENDPOINTS;

// atStake is only ever a real value for activate/retain/churn (same restriction as GET /map's
// atStake), and unavailable for two markets sharing a currency — one figure can't be split
// between two countries. population/primaryConversion are unavailable for every stage/market.
export const getStageMarkets = async (stageKey: string): Promise<GetStageMarketsResponse> => {
  try {
    const response = await axiosInstance.get<GetStageMarketsResponse>(
      GET_STAGE_MARKETS.replace("{stageKey}", stageKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's markets");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
