import { clearAuthCookies } from "./cookies";

export const handleLogout = () => {
  clearAuthCookies();
  // Optional: redirect to login
  window.location.href = "/auth/sign-in?fromLogout=true";
};
