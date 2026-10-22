import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetHomeParams {
  window?: 30 | 90 | 180 | 365;
}

export interface HomeFigure {
  currency: string;
  amount: number;
}

export interface HomeCard {
  kind: string;
  key: string;
  severity: number;
  asOfUtc: string;
  title: string;
  detail: string | null;
  figures: HomeFigure[];
  href: string | null;
  sourceId: string | null;
}

export interface HomeExposure extends HomeFigure {
  title: string;
  roomId: string | null;
}

/** What Flolyt has preserved/closed over a fixed window — always the last 30 days per this
 *  endpoint's own docs, independent of the `window` query param (that only scopes `cards`'
 *  figures), so a tenant's quoted preserved amount never shifts just because someone changed a
 *  dropdown elsewhere on the page. */
export interface HomeGuarded {
  days: number;
  roomsClosed: number;
  roomsOpen: number;
  decisionsWaitingOnYou: number;
  preserved: HomeFigure[];
  biggestExposure: HomeExposure[];
}

export interface HomeFactContext {
  stage: string | null;
  grid: string | null;
  rowKey: string | null;
  conditionKey: string | null;
  currency: string | null;
}

/** One of the (up to 5) most-worth-knowing things right now, ranked by severity. `question` is
 *  the prompt to hand a fresh conversation for a deep dive on this fact — see
 *  `POST /api/v3/conversations/messages`. */
export interface HomeFact {
  key: string;
  tone: string;
  severity: number;
  text: string;
  question: string;
  figures: HomeFigure[];
  context: HomeFactContext | null;
}

export interface HomeDto {
  window: {
    days: number;
    options: number[];
  };
  revenueModel: string | null;
  guarded: HomeGuarded;
  facts: HomeFact[];
  cards: HomeCard[];
  refreshedAtUtc: string | null;
}

export interface GetHomeResponse {
  data: HomeDto;
  messages: string[];
  succeeded: boolean;
}

const {
  HOME: { GET_HOME },
} = API_ENDPOINTS;

export const getHome = async (params?: GetHomeParams): Promise<GetHomeResponse> => {
  try {
    const response = await axiosInstance.get<GetHomeResponse>(GET_HOME, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch home");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
