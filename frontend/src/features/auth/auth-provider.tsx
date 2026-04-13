import { useEffect, useState, type PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "@/features/auth/auth-context";
import {
  authStorageKey,
  clearStoredAuthSession,
  readStoredAuthSession,
  storeAuthSession,
  type AuthSession,
} from "@/features/auth/auth-storage";

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    readStoredAuthSession(),
  );

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== null && event.key !== authStorageKey) {
        return;
      }

      queryClient.clear();
      setSessionState(readStoredAuthSession());
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [queryClient]);

  function setSession(nextSession: AuthSession) {
    storeAuthSession(nextSession);
    queryClient.clear();
    setSessionState(nextSession);
  }

  function logout() {
    clearStoredAuthSession();
    queryClient.clear();
    setSessionState(null);
  }

  return (
    <AuthContext.Provider
      value={{
        status: session ? "authenticated" : "unauthenticated",
        session,
        token: session?.token ?? null,
        user: session?.user ?? null,
        isAuthenticated: session !== null,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
