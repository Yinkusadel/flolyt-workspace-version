import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface PriceDiscountingBandDto {
  /** always | mostly | occasionally | never | too-few-orders (its own band, not an exclusion). */
  band: string;
  currency: string;
  customers: number;
  orders: number;
  shareOfCustomers: number | null;
  discountedOrders: number | null;
  revenue: number;
  discount: number;
  depth: number | null;
  /** Negative contribution = loses money on every order regardless of whether the discount was "needed." */
  contribution: number | null;
  contributionPerCustomer: number | null;
  /** Customers whose own history shows full-price orders before their first discount — evidence, not proof. */
  paidFullPriceFirst: number;
}

export interface PriceDiscountingData {
  bands: PriceDiscountingBandDto[];
  components: string[];
  hasCost: boolean;
  minimumOrders: number;
  currencies: string[];
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetPriceDiscountingResponse {
  data: PriceDiscountingData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_PRICE_DISCOUNTING },
} = API_ENDPOINTS;

export const getPriceDiscounting = async (): Promise<GetPriceDiscountingResponse> => {
  try {
    const response = await axiosInstance.get<GetPriceDiscountingResponse>(GET_PRICE_DISCOUNTING);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Price's discounting");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
