import { z } from "zod";

import type { AuthResponse } from "@/types";

const authUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  email: z.string().email(),
});

const authSessionSchema = z.object({
  token: z.string().min(1),
  user: authUserSchema,
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const authStorageKey = "taskflow.auth.session";

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function readStoredAuthSession(): AuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(authStorageKey);
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = authSessionSchema.safeParse(JSON.parse(rawSession));

    if (!parsed.success) {
      window.localStorage.removeItem(authStorageKey);
      return null;
    }

    return parsed.data;
  } catch {
    window.localStorage.removeItem(authStorageKey);
    return null;
  }
}

export function storeAuthSession(session: AuthResponse) {
  if (!canUseStorage()) {
    return;
  }

  const normalizedSession = authSessionSchema.parse(session);
  window.localStorage.setItem(
    authStorageKey,
    JSON.stringify(normalizedSession),
  );
}

export function clearStoredAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(authStorageKey);
}
