import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { COOKIE_KEYS, setCookie } from "@/utils/cookies";

export interface VerifyLoginCodePayload {
  challengeId: string;
  code: string;
}

export interface VerifyLoginCodeResponse {
  isAuthenticated: boolean;
  authenticationError: string | null;
  onboardingRequired: boolean;
  token: string | null;
  refreshToken: string | null;
  isPlatformAdmin: boolean;
}

const {
  USER: { VERIFY_LOGIN_CODE },
} = API_ENDPOINTS;

export const verifyLoginCode = async (
  payload: VerifyLoginCodePayload
): Promise<VerifyLoginCodeResponse> => {
  try {
    const response = await axiosInstance.post<VerifyLoginCodeResponse>(
      VERIFY_LOGIN_CODE,
      payload
    );

    const { token, refreshToken } = response.data;

    if (token) {
      setCookie(COOKIE_KEYS.AUTH_TOKEN, token, { expires: 7 });
    }

    if (refreshToken) {
      setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, { expires: 30 });
    }

    return response.data;
  } catch (error: unknown) {
    // Every code failure shares one message — wrong, expired, spent, out of
    // attempts, no such challenge. Never branch on it, just surface it.
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.authenticationError ||
          "That code is not valid. Request a new one and try again."
      );
    }

    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
