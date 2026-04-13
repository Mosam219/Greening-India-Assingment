import { apiRequest } from "@/lib/api-client";
import type {
  CreateProjectRequest,
  GetProjectResponse,
  GetProjectsResponse,
  GetProjectTasksQuery,
  GetProjectTasksResponse,
  Project,
} from "@/types";

export function getProjects(token: string) {
  return apiRequest<GetProjectsResponse>("/projects", {
    method: "GET",
    token,
  });
}

export function createProject(token: string, input: CreateProjectRequest) {
  return apiRequest<Project>("/projects", {
    method: "POST",
    token,
    body: input,
  });
}

export function getProjectDetail(token: string, projectId: string) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}`, {
    method: "GET",
    token,
  });
}

export function getProjectTasks(
  token: string,
  projectId: string,
  filters: GetProjectTasksQuery = {},
) {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  if (filters.assignee) {
    searchParams.set("assignee", filters.assignee);
  }

  const query = searchParams.toString();
  const pathname = query
    ? `/projects/${projectId}/tasks?${query}`
    : `/projects/${projectId}/tasks`;

  return apiRequest<GetProjectTasksResponse>(pathname, {
    method: "GET",
    token,
  });
}
