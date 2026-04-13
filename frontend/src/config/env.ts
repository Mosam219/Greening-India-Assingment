import { z } from "zod";

const rawEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_ENABLE_API_MOCKS: z.enum(["true", "false"]),
});

const parsedEnv = rawEnvSchema.parse({
  VITE_API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000",
  VITE_ENABLE_API_MOCKS: import.meta.env.VITE_ENABLE_API_MOCKS ?? "true",
});

export const env = {
  apiBaseUrl: parsedEnv.VITE_API_BASE_URL,
  enableApiMocks: parsedEnv.VITE_ENABLE_API_MOCKS === "true",
} as const;
