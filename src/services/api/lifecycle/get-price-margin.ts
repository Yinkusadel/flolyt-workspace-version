import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface PriceMarginMonthDto {
  period: string;
  currency: string;
  orders: number;
  revenue: number;
  cost: number;
  margin: number;
  marginRate: number | null;
  marginPerOrder: number | null;
}

export interface PriceMarginTrendDto {
  currency: string;
  from: string;
  to: string;
  fromRate: number | null;
  toRate: number | null;
  /** In percentage points — 40% to 30% is "ten points," never "25% down." */
  change: number | null;
}

export interface PriceMarginData {
  /** Measured at the order, never the line — no per-product breakdown. */
  months: PriceMarginMonthDto[];
  trend: PriceMarginTrendDto[];
  /** Which cost-of-sale parts are netted off — cost of goods required, shipping/fees optional. */
  components: string[];
  /** false means failed/cancelled/refunded orders are counted at full revenue while keeping
   * their cost — margin overstated by roughly the return rate. */
  excludesReturns: boolean;
  currencies: string[];
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetPriceMarginResponse {
  data: PriceMarginData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_PRICE_MARGIN },
} = API_ENDPOINTS;

export const getPriceMargin = async (): Promise<GetPriceMarginResponse> => {
  try {
    const response = await axiosInstance.get<GetPriceMarginResponse>(GET_PRICE_MARGIN);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Price's margin");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
