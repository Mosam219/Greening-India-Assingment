import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { ApiClientError } from "@/lib/api-client";

export function applyTaskFormError<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  allowedFields: readonly Path<TFieldValues>[],
) {
  const defaultMessage = "Something went wrong. Please try again.";

  if (!(error instanceof ApiClientError)) {
    return defaultMessage;
  }

  if (error.data?.error === "validation failed") {
    let hasMappedFieldErrors = false;
    const allowedFieldSet = new Set<string>(allowedFields);

    for (const field of allowedFields) {
      const message = error.data.fields[String(field)];
      if (!message) {
        continue;
      }

      hasMappedFieldErrors = true;
      setError(field, {
        type: "server",
        message,
      });
    }

    const firstUnmappedMessage = Object.entries(error.data.fields).find(
      ([field]) => !allowedFieldSet.has(field),
    )?.[1];

    if (firstUnmappedMessage) {
      return firstUnmappedMessage;
    }

    return hasMappedFieldErrors
      ? null
      : "Please review the form and try again.";
  }

  if (error.data?.error === "unauthorized") {
    return "Your session is no longer valid. Please sign in again.";
  }

  if (error.data?.error === "forbidden") {
    return "You do not have access to update this task.";
  }

  if (error.data?.error === "not found") {
    return "The task could not be found anymore.";
  }

  return error.message || defaultMessage;
}
