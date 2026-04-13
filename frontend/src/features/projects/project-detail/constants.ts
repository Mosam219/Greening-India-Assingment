import type { Task, TaskStatus } from "@/types";

export const statusSections: Array<{
  status: TaskStatus;
  label: string;
  description: string;
}> = [
  {
    status: "todo",
    label: "To do",
    description: "New work queued for the project.",
  },
  {
    status: "in_progress",
    label: "In progress",
    description: "Tasks currently being worked on.",
  },
  {
    status: "done",
    label: "Done",
    description: "Completed work for this project.",
  },
];

export const statusClassNames: Record<TaskStatus, string> = {
  todo: "bg-secondary text-secondary-foreground",
  in_progress: "bg-primary/12 text-primary",
  done: "bg-emerald-500/12 text-emerald-700",
};

export const priorityClassNames: Record<Task["priority"], string> = {
  low: "bg-slate-500/12 text-slate-700",
  medium: "bg-amber-500/12 text-amber-700",
  high: "bg-rose-500/12 text-rose-700",
};
