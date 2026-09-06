import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomCohortMarketDto {
  timeZoneId: string;
  customerCount: number;
}

export interface RoomCohortSampleCustomerDto {
  customerId: string;
  name: string;
  acquiredAtUtc: string | null;
  firstOrder: string | null;
  currency: string | null;
  daysSinceFirstOrder: number | null;
  timeZoneId: string | null;
  contactability: string;
  suppressionReason: string | null;
}

export interface RoomCohortData {
  roomId: string;
  totalCount: number;
  reachableCount: number;
  suppressedCount: number;
  cappedCount: number;
  markets: RoomCohortMarketDto[];
  sample: RoomCohortSampleCustomerDto[];
  sampledFromPool: number;
  exportable: boolean;
  computedAtUtc: string | null;
  notYetComputed: boolean;
  absentBecause: string | null;
}

export interface GetRoomCohortResponse {
  data: RoomCohortData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_COHORT },
} = API_ENDPOINTS;

// The sample of 12 is a sanity check, not evidence. Suppressed outranks capped — an opt-out
// doesn't expire, a cap does. `notYetComputed` means the room opened between passes and has no
// cohort yet — render that, never zeros. `computedAtUtc` can be up to 15 minutes stale.
export const getRoomCohort = async (roomId: string): Promise<GetRoomCohortResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomCohortResponse>(
      GET_ROOM_COHORT.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's cohort");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
