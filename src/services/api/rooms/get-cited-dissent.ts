import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetCitedDissentParams {
  proposalId: string;
  /** Default 10. */
  take?: number;
}

export interface RoomCitedDissentRowDto {
  id: string;
  wording: string;
  byUserId: string;
  byLabel: string;
  recordedAtUtc: string;
  fromRoomId: string;
  fromRoomTitle: string;
  fromRoomStatus: string;
  fromRoomOutcomeKind: string | null;
  borneOut: boolean | null;
  /** "same-action" (exact) vs "same-leak" (weaker). */
  tier: string;
}

export interface RoomCitedReadingDto {
  conflictId: string;
  fromRoomId: string;
  fromRoomTitle: string;
  label: string;
  recommends: string;
  because: string;
  longRunEffect: string | null;
  chosenInstead: string | null;
  why: string | null;
  resolvedAtUtc: string | null;
}

export interface CitedDissentData {
  cited: RoomCitedDissentRowDto[];
  returned: number;
  truncated: boolean;
  citedReadings: RoomCitedReadingDto[];
}

export interface GetCitedDissentResponse {
  data: CitedDissentData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_CITED_DISSENT },
} = API_ENDPOINTS;

export const getCitedDissent = async (
  roomId: string,
  params: GetCitedDissentParams
): Promise<GetCitedDissentResponse> => {
  try {
    const response = await axiosInstance.get<GetCitedDissentResponse>(
      GET_CITED_DISSENT.replace("{roomId}", roomId),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch prior objections cited for this leak");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
