import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/services/api/auth/logout";
import { COOKIE_KEYS, getCookie } from "@/utils/cookies";
import { handleLogout } from "@/utils/logout";
import { useAuth } from "@/utils/auth-context";

const useLogout = () => {
  const { setUser } = useAuth();

  const mutation = useMutation({
    mutationFn: () => logoutUser({ refreshToken: getCookie(COOKIE_KEYS.REFRESH_TOKEN) }),
    // Revoke the session server-side on a best-effort basis — the client-side
    // logout below must happen either way, or a failed request would strand
    // the user signed in.
    onSettled: () => {
      setUser(null);
      handleLogout();
    },
  });

  return {
    logout: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
};

export default useLogout;
