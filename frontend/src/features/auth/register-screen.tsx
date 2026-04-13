import { useMutation } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { register as registerUser } from "@/features/auth/auth-api";
import { applyAuthFormError } from "@/features/auth/auth-form-errors";
import { AuthPageFrame } from "@/features/auth/auth-page-frame";
import {
  getSafeRedirectPath,
  withRedirectQuery,
} from "@/features/auth/auth-redirect";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/features/auth/auth-schemas";
import { useAuth } from "@/features/auth/use-auth";
import { AuthFormField } from "@/features/auth/forms/auth-form-field";

const highlightItems = [
  {
    eyebrow: "Immediate Access",
    title: "Register and enter the protected workspace",
    description:
      "A successful registration stores the JWT session locally and redirects straight into the app.",
  },
  {
    eyebrow: "Validation",
    title: "Client and server errors stay visible",
    description:
      "The form enforces client rules first and still renders backend-style validation responses like duplicate email conflicts.",
  },
];

export function RegisterScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, setSession } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const redirectTo = getSafeRedirectPath(searchParams.get("redirectTo"));

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  if (isAuthenticated) {
    return <Navigate replace to={redirectTo} />;
  }

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);

    try {
      const session = await registerMutation.mutateAsync(values);
      setSession(session);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = applyAuthFormError(error, form.setError, [
        "name",
        "email",
        "password",
      ]);
      setSubmitError(message);
    }
  }

  return (
    <AuthPageFrame
      badge="Step 7"
      title="Create your TaskFlow account"
      description="Registration uses the same backend contract as login, persists your JWT-backed session, and sends you directly into the protected project workspace."
      highlights={highlightItems}
      footer={
        <p className="text-sm leading-7 text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={withRedirectQuery("/login", redirectTo)}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in instead
          </Link>
          .
        </p>
      }
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Register
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Create account
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Add your name, email, and password to create a new session-backed
          user.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <AuthFormField
          id="register-name"
          autoComplete="name"
          placeholder="Jane Doe"
          label="Full name"
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />

        <AuthFormField
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          label="Email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <AuthFormField
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Choose a password"
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </AuthPageFrame>
  );
}
