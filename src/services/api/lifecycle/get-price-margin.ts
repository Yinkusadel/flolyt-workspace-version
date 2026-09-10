import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

// Confirmed 2026-09-10 from a real GET /lifecycle/price/margin response: marginRate/
// marginPerOrder/fromRate/toRate/change are all the same measured-value wrapper used elsewhere in
// this domain (see get-lifecycle-map.ts's LifecycleMeasuredValueDto), not bare `number | null` as
// first typed — that mistyping rendered as "NaN%" / "₦[object Object]" until fixed.
export interface PriceMarginMonthDto {
  period: string;
  currency: string;
  orders: number;
  revenue: number;
  cost: number;
  margin: number;
  marginRate: LifecycleMeasuredValueDto<number>;
  marginPerOrder: LifecycleMeasuredValueDto<number>;
}

export interface PriceMarginTrendDto {
  currency: string;
  from: string;
  to: string;
  fromRate: LifecycleMeasuredValueDto<number>;
  toRate: LifecycleMeasuredValueDto<number>;
  /** Confirmed 2026-09-10: same 0-1 fraction scale as fromRate/toRate (e.g. -0.0010 for 24.07% →
   *  23.98%), not already multiplied into percentage points — multiply by 100 before rounding, or
   *  "-0.1 pts" renders as "-0.0 pts". */
  change: LifecycleMeasuredValueDto<number>;
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
