import Cookies from "js-cookie";

export const COOKIE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const setCookie = (key: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(key, value, {
    ...options,
    secure: import.meta.env.PROD,
    sameSite: "strict",
  });
};

export const getCookie = (key: string) => {
  return Cookies.get(key);
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};

export const clearAuthCookies = () => {
  Object.values(COOKIE_KEYS).forEach((key) => removeCookie(key));
};
