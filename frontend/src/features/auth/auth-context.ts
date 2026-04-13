import { createContext } from "react";

import type { AuthSession } from "@/features/auth/auth-storage";

export type AuthStatus = "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  session: AuthSession | null;
  token: string | null;
  user: AuthSession["user"] | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
