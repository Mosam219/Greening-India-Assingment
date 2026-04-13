import { useMutation } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { login } from "@/features/auth/auth-api";
import { applyAuthFormError } from "@/features/auth/auth-form-errors";
import { AuthPageFrame } from "@/features/auth/auth-page-frame";
import {
  getSafeRedirectPath,
  withRedirectQuery,
} from "@/features/auth/auth-redirect";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/auth/auth-schemas";
import { useAuth } from "@/features/auth/use-auth";
import { AuthFormField } from "@/features/auth/forms/auth-form-field";

const highlightItems = [
  {
    eyebrow: "Mock Backend",
    title: "MSW-backed API at localhost:4000",
    description:
      "The form submits through the same HTTP contract a real backend would expose, including latency and structured errors.",
  },
  {
    eyebrow: "Demo Credentials",
    title: "Use the seeded reviewer account",
    description: "Email: test@example.com\nPassword: password123",
  },
];

export function LoginScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, setSession } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const redirectTo = getSafeRedirectPath(searchParams.get("redirectTo"));

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
  });

  if (isAuthenticated) {
    return <Navigate replace to={redirectTo} />;
  }

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);

    try {
      const session = await loginMutation.mutateAsync(values);
      setSession(session);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = applyAuthFormError(error, form.setError, [
        "email",
        "password",
      ]);
      setSubmitError(message);
    }
  }

  return (
    <AuthPageFrame
      badge="Step 7"
      title="Welcome back to TaskFlow"
      description="Sign in with a seeded account or your own registered user. Authentication state persists across refreshes and unlocks the protected workspace routes."
      highlights={highlightItems}
      footer={
        <p className="text-sm leading-7 text-muted-foreground">
          Need an account?{" "}
          <Link
            to={withRedirectQuery("/register", redirectTo)}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create one here
          </Link>
          .
        </p>
      }
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Sign In
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Login
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Enter your email and password to continue into the protected
          workspace.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <AuthFormField
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          label="Email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <AuthFormField
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          label="Password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        {submitError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        <Button
          className="w-full"
          size="lg"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </AuthPageFrame>
  );
}
