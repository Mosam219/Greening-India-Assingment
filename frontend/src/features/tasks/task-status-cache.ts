import type {
  GetProjectResponse,
  GetProjectTasksResponse,
  Task,
  TaskStatus,
} from "@/types";

type StatusFilterValue = "all" | TaskStatus;
type AssigneeFilterValue = "all" | "me" | string;

export type ProjectTasksQueryKey = readonly [
  "project-tasks",
  string,
  StatusFilterValue,
  AssigneeFilterValue,
  string | undefined,
];

export function createOptimisticStatusTask(
  task: Task,
  nextStatus: TaskStatus,
): Task {
  return {
    ...task,
    status: nextStatus,
    updated_at: new Date().toISOString(),
  };
}

export function updateProjectDetailTask(
  project: GetProjectResponse | undefined,
  nextTask: Task,
) {
  if (!project) {
    return project;
  }

  return {
    ...project,
    tasks: sortTasksByUpdatedAt(
      project.tasks.map((task) => (task.id === nextTask.id ? nextTask : task)),
    ),
  };
}

export function updateProjectTasksResponse(
  response: GetProjectTasksResponse | undefined,
  queryKey: readonly unknown[],
  nextTask: Task,
) {
  if (!response) {
    return response;
  }

  const remainingTasks = response.tasks.filter((task) => task.id !== nextTask.id);

  if (!matchesProjectTasksQuery(queryKey, nextTask)) {
    return {
      tasks: sortTasksByUpdatedAt(remainingTasks),
    };
  }

  return {
    tasks: sortTasksByUpdatedAt([nextTask, ...remainingTasks]),
  };
}

function sortTasksByUpdatedAt(tasks: Task[]) {
  return [...tasks].sort((left, right) =>
    right.updated_at.localeCompare(left.updated_at),
  );
}

function matchesProjectTasksQuery(queryKey: readonly unknown[], task: Task) {
  if (!isProjectTasksQueryKey(queryKey)) {
    return false;
  }

  const [, , statusFilter, assigneeFilter, currentUserId] = queryKey;
  const matchesStatus =
    statusFilter === "all" || task.status === statusFilter;

  const matchesAssignee =
    assigneeFilter === "all"
      ? true
      : assigneeFilter === "me"
        ? Boolean(currentUserId) && task.assignee_id === currentUserId
        : task.assignee_id === assigneeFilter;

  return matchesStatus && matchesAssignee;
}

function isProjectTasksQueryKey(
  queryKey: readonly unknown[],
): queryKey is ProjectTasksQueryKey {
  return queryKey[0] === "project-tasks" && typeof queryKey[1] === "string";
}
