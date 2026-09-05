import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ExpandBasketMonthDto {
  period: string;
  currency: string;
  customers: number;
  orders: number;
  revenue: number;
  averageOrderValue: number | null;
  ordersPerCustomer: number | null;
  revenuePerCustomer: number | null;
}

export interface ExpandBasketMovementDto {
  currency: string;
  from: string;
  to: string;
  revenuePerCustomerChange: number | null;
  averageOrderValueChange: number | null;
  ordersPerCustomerChange: number | null;
  driver: string;
}

export interface ExpandBasketLineDto {
  item: string;
  /** Counted, never priced — an item price is a unit price on some schemas, a line total on others. */
  lines: number;
  units: number | null;
  share: number | null;
}

export interface ExpandBasketData {
  /** Read over 13 complete months so both window ends land on the same calendar month a year apart. */
  months: ExpandBasketMonthDto[];
  movement: ExpandBasketMovementDto[];
  /** Refuses separately from months/movement — needs order lines, not just amount+date. */
  lines: ExpandBasketLineDto[];
  grain: string | null;
  currencies: string[];
  caveat: string | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetExpandBasketResponse {
  data: ExpandBasketData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_EXPAND_BASKET },
} = API_ENDPOINTS;

export const getExpandBasket = async (): Promise<GetExpandBasketResponse> => {
  try {
    const response = await axiosInstance.get<GetExpandBasketResponse>(GET_EXPAND_BASKET);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Expand's basket");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
