import type { Task, TaskStatus } from "@/types";

export type StatusFilterValue = "all" | TaskStatus;
export type AssigneeFilterValue = "all" | "me" | string;

export type AssigneeFilterOption = {
  value: AssigneeFilterValue;
  label: string;
};

export type GroupedTasks = Record<TaskStatus, Task[]>;

export type TaskEditorState =
  | {
      mode: "create";
      task?: undefined;
    }
  | {
      mode: "edit";
      task: Task;
    };

export type UpdateTaskStatusVariables = {
  task: Task;
  nextStatus: TaskStatus;
};
