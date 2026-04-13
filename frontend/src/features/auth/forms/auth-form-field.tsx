import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
};

export function AuthFormField({
  id,
  label,
  error,
  ...inputProps
}: AuthFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={error ? "true" : "false"} {...inputProps} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
