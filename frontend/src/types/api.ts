import type {
  AuthUser,
  EntityId,
  IsoDateString,
  Project,
  ProjectDetail,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/types/domain'

export interface FieldErrors {
  [field: string]: string
}

export interface ValidationErrorResponse {
  error: 'validation failed'
  fields: FieldErrors
}

export interface UnauthorizedErrorResponse {
  error: 'unauthorized'
}

export interface ForbiddenErrorResponse {
  error: 'forbidden'
}

export interface NotFoundErrorResponse {
  error: 'not found'
}

export type ApiErrorResponse =
  | ValidationErrorResponse
  | UnauthorizedErrorResponse
  | ForbiddenErrorResponse
  | NotFoundErrorResponse

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GetProjectsResponse {
  projects: Project[]
}

export interface CreateProjectRequest {
  name: string
  description?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
}

export type GetProjectResponse = ProjectDetail

export interface GetProjectTasksQuery {
  status?: TaskStatus
  assignee?: EntityId
}

export interface GetProjectTasksResponse {
  tasks: Task[]
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority: TaskPriority
  assignee_id?: EntityId | null
  due_date?: IsoDateString | null
}

export interface UpdateTaskRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  assignee_id?: EntityId | null
  due_date?: IsoDateString | null
}
