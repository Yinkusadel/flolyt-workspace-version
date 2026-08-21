import axios from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { COOKIE_KEYS, getCookie, setCookie } from "@/utils/cookies";

const { USER: { REFRESH_TOKEN } } = API_ENDPOINTS;

export interface RefreshTokenResponse {
  isAuthenticated: boolean;
  authenticationError: string | null;
  onboardingRequired: boolean;
  token: string | null;
  refreshToken: string | null;
  isPlatformAdmin: boolean;
}

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);

    const response = await axios.post<RefreshTokenResponse>(REFRESH_TOKEN, {
      refreshToken,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    const { isAuthenticated, token: newAccessToken, refreshToken: newRefreshToken } = response.data;

    // HTTP 200 can still mean rejected — always check isAuthenticated
    if (!isAuthenticated || !newAccessToken) {
      return null;
    }

    setCookie(COOKIE_KEYS.AUTH_TOKEN, newAccessToken, { expires: 7 });

    // Persist the rotated refresh token — failing to do this causes reuse-detection logout
    if (newRefreshToken) {
      setCookie(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken, { expires: 30 });
    }

    return newAccessToken;

  } catch (error: any) {
    // Re-throw 429 so the interceptor can surface a rate-limit message instead of logging out
    if (error?.response?.status === 429) {
      throw error;
    }

    console.error("refreshAccessToken → failed:", error?.response?.data ?? error?.message);
    return null;
  }
};
