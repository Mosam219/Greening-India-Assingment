import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus, SquarePen, X } from "lucide-react";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  projectDetailQueryKey,
  projectTasksBaseQueryKey,
} from "@/features/projects/query-keys";
import { createTask, updateTask } from "@/features/tasks/tasks-api";
import { applyTaskFormError } from "@/features/tasks/task-form-errors";
import {
  getTaskFormDefaultValues,
  taskFormSchema,
  toCreateTaskRequest,
  toUpdateTaskRequest,
  type TaskFormValues,
} from "@/features/tasks/tasks-schemas";
import type { Task } from "@/types";

const taskFormFields = [
  "title",
  "description",
  "status",
  "priority",
  "assignee_id",
  "due_date",
] as const;

type TaskEditorMode = "create" | "edit";

export type TaskAssigneeOption = {
  value: string;
  label: string;
};

type TaskEditorPanelProps = {
  open: boolean;
  mode: TaskEditorMode;
  projectId: string;
  projectName: string;
  token: string;
  assigneeOptions: TaskAssigneeOption[];
  task?: Task;
  onClose: () => void;
};

export function TaskEditorPanel({
  open,
  mode,
  projectId,
  projectName,
  token,
  assigneeOptions,
  task,
  onClose,
}: TaskEditorPanelProps) {
  const titleId = useId();
  const queryClient = useQueryClient();
  const detailQueryKey = projectDetailQueryKey(projectId);
  const tasksQueryKey = projectTasksBaseQueryKey(projectId);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getTaskFormDefaultValues(task),
  });

  const saveTaskMutation = useMutation({
    mutationFn: async (values: TaskFormValues) => {
      if (mode === "create") {
        return createTask(token, projectId, toCreateTaskRequest(values));
      }

      if (!task) {
        throw new Error("A task is required to edit this form.");
      }

      return updateTask(token, task.id, toUpdateTaskRequest(values));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: tasksQueryKey,
        }),
      ]);

      onClose();
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(getTaskFormDefaultValues(task));
  }, [form, open, task]);

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saveTaskMutation.isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, saveTaskMutation.isPending]);

  async function onSubmit(values: TaskFormValues) {
    form.clearErrors("root");

    try {
      await saveTaskMutation.mutateAsync(values);
    } catch (error) {
      const message = applyTaskFormError(error, form.setError, taskFormFields);
      if (message) {
        form.setError("root", {
          type: "server",
          message,
        });
      }
    }
  }

  function handleClose() {
    if (saveTaskMutation.isPending) {
      return;
    }

    onClose();
  }

  if (!open || typeof document === "undefined") {
    return null;
  }

  const isCreateMode = mode === "create";
  const dialogTitle = isCreateMode ? "Create task" : "Edit task";
  const dialogDescription = isCreateMode
    ? `Add a new task to ${projectName}. New tasks start in To do to match the backend contract.`
    : "Update the task details, status, ownership, or due date from the project workspace.";

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close task editor"
        className="absolute inset-0 bg-slate-950/50"
        onClick={handleClose}
      />

      <div className="relative ml-auto flex h-full w-full max-w-2xl">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative flex h-full w-full flex-col overflow-hidden border-l border-border/70 bg-background shadow-2xl"
        >
          <div className="border-b border-border/70 px-6 py-5 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
                  {isCreateMode ? "New task" : "Update task"}
                </p>
                <h2
                  id={titleId}
                  className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
                >
                  {dialogTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {dialogDescription}
                </p>
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Close task editor"
                onClick={handleClose}
                disabled={saveTaskMutation.isPending}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <form
            className="flex min-h-0 flex-1 flex-col"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Design homepage"
                    aria-invalid={
                      form.formState.errors.title ? "true" : "false"
                    }
                    {...form.register("title")}
                  />
                  {form.formState.errors.title ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Add context, expected outcome, or handoff notes."
                    aria-invalid={
                      form.formState.errors.description ? "true" : "false"
                    }
                    {...form.register("description")}
                  />
                  {form.formState.errors.description ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  ) : null}
                </div>

                {isCreateMode ? (
                  <div className="space-y-2">
                    <Label htmlFor="task-status-display">Status</Label>
                    <input type="hidden" {...form.register("status")} />
                    <div
                      id="task-status-display"
                      className="flex h-11 items-center rounded-xl border border-dashed border-border/80 bg-muted/35 px-3 text-sm font-medium text-foreground"
                    >
                      To do
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      New tasks are created in the To do column. You can change
                      status after creation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="task-status">Status</Label>
                    <Select
                      id="task-status"
                      aria-invalid={
                        form.formState.errors.status ? "true" : "false"
                      }
                      {...form.register("status")}
                    >
                      <option value="todo">To do</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                    </Select>
                    {form.formState.errors.status ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.status.message}
                      </p>
                    ) : null}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select
                      id="task-priority"
                      aria-invalid={
                        form.formState.errors.priority ? "true" : "false"
                      }
                      {...form.register("priority")}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                    {form.formState.errors.priority ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.priority.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-assignee">Assignee</Label>
                    <Select
                      id="task-assignee"
                      aria-invalid={
                        form.formState.errors.assignee_id ? "true" : "false"
                      }
                      {...form.register("assignee_id")}
                    >
                      <option value="">Unassigned</option>
                      {assigneeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {form.formState.errors.assignee_id ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.assignee_id.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Due date</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    aria-invalid={
                      form.formState.errors.due_date ? "true" : "false"
                    }
                    {...form.register("due_date")}
                  />
                  {form.formState.errors.due_date ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.due_date.message}
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-muted-foreground">
                      Leave blank if this task does not have a deadline.
                    </p>
                  )}
                </div>

                {form.formState.errors.root?.message ? (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-border/70 px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={saveTaskMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveTaskMutation.isPending}>
                  {saveTaskMutation.isPending ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : isCreateMode ? (
                    <>
                      <Plus className="size-4" />
                      Create task
                    </>
                  ) : (
                    <>
                      <SquarePen className="size-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>,
    document.body,
  );
}
