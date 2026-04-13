export const taskStatuses = ['todo', 'in_progress', 'done'] as const
export const taskPriorities = ['low', 'medium', 'high'] as const

export type EntityId = string
export type IsoDateString = string
export type IsoDateTimeString = string

export type TaskStatus = (typeof taskStatuses)[number]
export type TaskPriority = (typeof taskPriorities)[number]

export interface AuthUser {
  id: EntityId
  name: string
  email: string
}

export interface User extends AuthUser {
  created_at: IsoDateTimeString
}

export interface Project {
  id: EntityId
  name: string
  description: string | null
  owner_id: EntityId
  created_at: IsoDateTimeString
}

export interface Task {
  id: EntityId
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  project_id?: EntityId
  assignee_id: EntityId | null
  due_date: IsoDateString | null
  created_at: IsoDateTimeString
  updated_at: IsoDateTimeString
}

export interface ProjectDetail extends Project {
  tasks: Task[]
}
