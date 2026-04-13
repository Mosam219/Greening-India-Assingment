import { apiRequest } from "@/lib/api-client";
import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types";

export function createTask(
  token: string,
  projectId: string,
  input: CreateTaskRequest,
) {
  return apiRequest<Task>(`/projects/${projectId}/tasks`, {
    method: "POST",
    token,
    body: input,
  });
}

export function updateTask(
  token: string,
  taskId: string,
  input: UpdateTaskRequest,
) {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    token,
    body: input,
  });
}
