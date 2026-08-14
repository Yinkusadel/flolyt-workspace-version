// src/utils/auth.ts or src/utils/user.ts

import { clearAuthCookies, COOKIE_KEYS, getCookie } from "./cookies";

export const getCurrentUser = () => {
  const userData = getCookie(COOKIE_KEYS.USER_DATA);

  const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);

  //   console.log("AUTH TOKEN:", token)
  // console.log("USER DATA:", userData)

  if (!token) {
    clearAuthCookies();
    return null;
  }

  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    clearAuthCookies();
    return null;
  }
};
