import { z } from "zod";

import { requiredTextField } from "@/lib/validation/common";
import {
  taskPriorities,
  taskStatuses,
  type CreateTaskRequest,
  type Task,
  type UpdateTaskRequest,
} from "@/types";

const optionalAssigneeSchema = z.union([
  z.literal(""),
  z.string().uuid("Select a valid assignee"),
]);

const optionalDueDateSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Enter a valid date in YYYY-MM-DD format",
  );

export const taskFormSchema = z.object({
  title: requiredTextField("Task title", 160),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer"),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  assignee_id: optionalAssigneeSchema,
  due_date: optionalDueDateSchema,
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

function normalizeOptionalText(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeOptionalDate(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function getTaskFormDefaultValues(task?: Task): TaskFormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "todo",
    priority: task?.priority ?? "medium",
    assignee_id: task?.assignee_id ?? "",
    due_date: task?.due_date ?? "",
  };
}

export function toCreateTaskRequest(values: TaskFormValues): CreateTaskRequest {
  const description = normalizeOptionalText(values.description);

  return {
    title: values.title,
    description: description ?? undefined,
    priority: values.priority,
    assignee_id: values.assignee_id || null,
    due_date: normalizeOptionalDate(values.due_date),
  };
}

export function toUpdateTaskRequest(values: TaskFormValues): UpdateTaskRequest {
  return {
    title: values.title,
    description: normalizeOptionalText(values.description),
    status: values.status,
    priority: values.priority,
    assignee_id: values.assignee_id || null,
    due_date: normalizeOptionalDate(values.due_date),
  };
}
