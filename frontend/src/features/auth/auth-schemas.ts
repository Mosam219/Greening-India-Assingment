import { z } from "zod";

import {
  emailFieldSchema,
  nameFieldSchema,
  passwordFieldSchema,
} from "@/lib/validation/common";

export const loginFormSchema = z.object({
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export const registerFormSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
