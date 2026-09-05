import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface SupportContactDriverDto {
  driver: string;
  tickets: number;
  customers: number;
  shareOfTickets: number | null;
  /** Distinguishes "one furious person" from "ten units of queue work." */
  ticketsPerCustomer: number | null;
  refunded: number | null;
}

export interface SupportContactDriversData {
  drivers: SupportContactDriverDto[];
  tickets: number | null;
  windowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetSupportContactDriversResponse {
  data: SupportContactDriversData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_SUPPORT_CONTACT_DRIVERS },
} = API_ENDPOINTS;

export const getSupportContactDrivers = async (): Promise<GetSupportContactDriversResponse> => {
  try {
    const response = await axiosInstance.get<GetSupportContactDriversResponse>(GET_SUPPORT_CONTACT_DRIVERS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Support's contact drivers");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
