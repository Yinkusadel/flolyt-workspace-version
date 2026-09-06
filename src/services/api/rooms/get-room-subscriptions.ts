import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetRoomSubscriptionsParams {
  /** Pass to read somebody else's — the point of this screen. */
  userId?: string;
}

export interface RoomSubscriptionRowDto {
  roomId: string;
  title: string;
  restricted: boolean;
  reason: string | null;
  notifyLevel: string;
  amountAtRisk: number | null;
  currency: string | null;
  sinceUtc: string;
  lastOpenedAtUtc: string | null;
  ownsIt: boolean;
  canMute: boolean;
  asksWhetherStillWanted: boolean;
}

export interface RoomSubscriptionsData {
  userId: string;
  watching: number;
  owned: number;
  reachingTheirDigest: number;
  muted: number;
  autoAddedThisMonth: number;
  askingWhetherStillWanted: number;
  rooms: RoomSubscriptionRowDto[];
}

export interface GetRoomSubscriptionsResponse {
  data: RoomSubscriptionsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_SUBSCRIPTIONS },
} = API_ENDPOINTS;

// Muted rooms count in BOTH `watching` and `muted` — muting doesn't hide, stays searchable.
// `canMute` is false on a room they own — render the reason, not a missing control.
export const getRoomSubscriptions = async (
  params?: GetRoomSubscriptionsParams
): Promise<GetRoomSubscriptionsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomSubscriptionsResponse>(
      GET_ROOM_SUBSCRIPTIONS,
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch room subscriptions");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
