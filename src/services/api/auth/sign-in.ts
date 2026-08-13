import axios from "axios";
import { API_ENDPOINTS } from "@//config/apiConfig";
import { COOKIE_KEYS, setCookie } from "@//utils/cookies";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  isAuthenticated: boolean;
  authenticationError: string | null;
  onboardingRequired: boolean;
  token: string | null;
  refreshToken: string | null;
  isPlatformAdmin: boolean;
}

const {
  USER: { SIGN_IN },
} = API_ENDPOINTS;

export const signIn = async (credentials: SignInCredentials): Promise<SignInResponse> => {
  try {
    const response = await axios.post<SignInResponse>(SIGN_IN, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    const { token, refreshToken } = response.data;

    if (token) {
      // store main auth token
      setCookie(COOKIE_KEYS.AUTH_TOKEN, token, { expires: 7 });
    }

    if (refreshToken) {
      // store refresh token
      setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, { expires: 30 });
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"];
        const msg = retryAfter
          ? `Too many login attempts — please wait ${retryAfter} seconds.`
          : "Too many login attempts — please wait a moment.";
        throw new Error(msg);
      }
      throw new Error(error.response.data?.authenticationError || "Login failed");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
