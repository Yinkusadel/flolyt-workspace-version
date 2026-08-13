import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser } from "./user";


type User = {
  id: string;
  name: string;
  email?: string;
  hasCompletedOnboarding: boolean;
  isPlatformAdmin?: boolean;
  tenantCurrency?: string;
  companyId?: string;
  companyName?: string;
  timeZoneId?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const current = await getCurrentUser();
    setUser(current);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
