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

export interface HomeDto {
  window: {
    days: number;
    options: number[];
  };
  revenueModel: string | null;
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
