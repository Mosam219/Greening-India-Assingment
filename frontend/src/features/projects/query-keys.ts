type ProjectTasksQueryKeyParams = {
  projectId: string;
  statusFilter: string;
  assigneeFilter: string;
  currentUserId?: string | null;
};

export function projectsQueryKey(userId: string | null | undefined) {
  return ["projects", userId ?? "guest"] as const;
}

export function projectDetailQueryKey(projectId: string) {
  return ["project-detail", projectId] as const;
}

export function projectTasksBaseQueryKey(projectId: string) {
  return ["project-tasks", projectId] as const;
}

export function projectTasksQueryKey({
  projectId,
  statusFilter,
  assigneeFilter,
  currentUserId,
}: ProjectTasksQueryKeyParams) {
  return [
    "project-tasks",
    projectId,
    statusFilter,
    assigneeFilter,
    currentUserId ?? "guest",
  ] as const;
}
