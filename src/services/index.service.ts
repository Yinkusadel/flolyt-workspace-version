
import axios, { AxiosHeaders } from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/apiConfig";
import { COOKIE_KEYS, getCookie } from "@/utils/cookies";
import { refreshAccessToken } from "./api/auth/refresh-token";
import { handleLogout } from "@/utils/logout";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);

    if (!config.headers) config.headers = new AxiosHeaders();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Rate-limited — surface a friendly message, never logout
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers?.["retry-after"];
      const msg = retryAfter
        ? `Too many attempts — please wait ${retryAfter} second${retryAfter === "1" ? "" : "s"}.`
        : "Too many attempts — please wait a moment.";
      toast.error(msg);
      return Promise.reject(error);
    }

    // Already retried with a fresh token and still got 401 → session is genuinely gone
    if (error.response?.status === 401 && originalRequest._retry) {
      handleLogout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken();
        }

        const newToken = await refreshPromise;
        refreshPromise = null;

        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          handleLogout();
          return Promise.reject(error);
        }
      } catch (e: any) {
        refreshPromise = null;

        // 429 on /token/refresh — don't logout, just surface the message
        if (e?.response?.status === 429) {
          const retryAfter = e.response.headers?.["retry-after"];
          const msg = retryAfter
            ? `Too many attempts — please wait ${retryAfter} second${retryAfter === "1" ? "" : "s"}.`
            : "Too many attempts — please wait a moment.";
          toast.error(msg);
          return Promise.reject(e);
        }

        handleLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
