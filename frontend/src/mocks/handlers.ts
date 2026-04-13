import { HttpResponse, http } from 'msw'
import { z } from 'zod'

import {
  canDeleteTask,
  createMockToken,
  createProjectRecord,
  createTaskRecord,
  createUserRecord,
  deleteProjectRecord,
  deleteTaskRecord,
  findUserByCredentials,
  findUserByEmail,
  findUserById,
  getProjectById,
  getProjectDetail,
  getProjectsForUser,
  getTaskRecordById,
  hasProjectAccess,
  isProjectOwner,
  listTasksForProject,
  toAuthUser,
  updateProjectRecord,
  updateTaskRecord,
} from '@/mocks/data'
import {
  apiUrl,
  applyMockDelay,
  forbiddenError,
  getForcedErrorResponse,
  notFoundError,
  parseJsonBody,
  parseSearchParams,
  requireAuth,
  unauthorizedError,
  validationError,
} from '@/mocks/utils'
import {
  emailFieldSchema,
  nameFieldSchema,
  passwordFieldSchema,
  requiredTextField,
} from '@/lib/validation/common'
import { taskPriorities, taskStatuses } from '@/types'

const entityIdSchema = z.string().uuid()
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date in YYYY-MM-DD format')
const descriptionFieldSchema = z
  .string()
  .trim()
  .max(500, 'Description must be 500 characters or fewer')

const registerRequestSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  password: passwordFieldSchema,
})

const loginRequestSchema = z.object({
  email: emailFieldSchema,
  password: z.string().min(1, 'Password is required'),
})

const createProjectRequestSchema = z.object({
  name: requiredTextField('Project name', 120),
  description: descriptionFieldSchema.optional(),
})

const updateProjectRequestSchema = z
  .object({
    name: requiredTextField('Project name', 120).optional(),
    description: descriptionFieldSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
    path: ['body'],
  })

const projectTasksQuerySchema = z.object({
  status: z.enum(taskStatuses).optional(),
  assignee: entityIdSchema.optional(),
  mockError: z.string().optional(),
  mockDelay: z.string().optional(),
})

const createTaskRequestSchema = z.object({
  title: requiredTextField('Task title', 160),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be 1000 characters or fewer')
    .optional(),
  priority: z.enum(taskPriorities),
  assignee_id: z.union([entityIdSchema, z.null()]).optional(),
  due_date: z.union([isoDateSchema, z.null()]).optional(),
})

const updateTaskRequestSchema = z
  .object({
    title: requiredTextField('Task title', 160).optional(),
    description: z
      .union([
        z.string().trim().max(1000, 'Description must be 1000 characters or fewer'),
        z.null(),
      ])
      .optional(),
    status: z.enum(taskStatuses).optional(),
    priority: z.enum(taskPriorities).optional(),
    assignee_id: z.union([entityIdSchema, z.null()]).optional(),
    due_date: z.union([isoDateSchema, z.null()]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
    path: ['body'],
  })

export const handlers = [
  http.post(apiUrl('/auth/register'), async ({ request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const parsedBody = await parseJsonBody(request, registerRequestSchema)
    if (parsedBody.response) {
      return parsedBody.response
    }

    if (findUserByEmail(parsedBody.data.email)) {
      return validationError({ email: 'Email is already in use' })
    }

    const user = createUserRecord(parsedBody.data)
    return HttpResponse.json(
      {
        token: createMockToken(user.id),
        user: toAuthUser(user),
      },
      { status: 201 },
    )
  }),

  http.post(apiUrl('/auth/login'), async ({ request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const parsedBody = await parseJsonBody(request, loginRequestSchema)
    if (parsedBody.response) {
      return parsedBody.response
    }

    const user = findUserByCredentials(parsedBody.data.email, parsedBody.data.password)
    if (!user) {
      return unauthorizedError()
    }

    return HttpResponse.json({
      token: createMockToken(user.id),
      user: toAuthUser(user),
    })
  }),

  http.get(apiUrl('/projects'), async ({ request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    return HttpResponse.json({
      projects: getProjectsForUser(auth.user.id),
    })
  }),

  http.post(apiUrl('/projects'), async ({ request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const parsedBody = await parseJsonBody(request, createProjectRequestSchema)
    if (parsedBody.response) {
      return parsedBody.response
    }

    const project = createProjectRecord(parsedBody.data, auth.user.id)
    return HttpResponse.json(project, { status: 201 })
  }),

  http.get(apiUrl('/projects/:projectId'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const projectId = String(params.projectId)
    const project = getProjectById(projectId)
    if (!project) {
      return notFoundError()
    }

    if (!hasProjectAccess(auth.user.id, projectId)) {
      return forbiddenError()
    }

    return HttpResponse.json(getProjectDetail(projectId))
  }),

  http.patch(apiUrl('/projects/:projectId'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const projectId = String(params.projectId)
    const project = getProjectById(projectId)
    if (!project) {
      return notFoundError()
    }

    if (!isProjectOwner(auth.user.id, projectId)) {
      return forbiddenError()
    }

    const parsedBody = await parseJsonBody(request, updateProjectRequestSchema)
    if (parsedBody.response) {
      return parsedBody.response
    }

    return HttpResponse.json(updateProjectRecord(projectId, parsedBody.data))
  }),

  http.delete(apiUrl('/projects/:projectId'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const projectId = String(params.projectId)
    const project = getProjectById(projectId)
    if (!project) {
      return notFoundError()
    }

    if (!isProjectOwner(auth.user.id, projectId)) {
      return forbiddenError()
    }

    deleteProjectRecord(projectId)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(apiUrl('/projects/:projectId/tasks'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const projectId = String(params.projectId)
    const project = getProjectById(projectId)
    if (!project) {
      return notFoundError()
    }

    if (!hasProjectAccess(auth.user.id, projectId)) {
      return forbiddenError()
    }

    const parsedQuery = parseSearchParams(request, projectTasksQuerySchema)
    if (parsedQuery.response) {
      return parsedQuery.response
    }

    return HttpResponse.json({
      tasks: listTasksForProject(projectId, {
        status: parsedQuery.data.status,
        assignee: parsedQuery.data.assignee,
      }),
    })
  }),

  http.post(apiUrl('/projects/:projectId/tasks'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const projectId = String(params.projectId)
    const project = getProjectById(projectId)
    if (!project) {
      return notFoundError()
    }

    if (!hasProjectAccess(auth.user.id, projectId)) {
      return forbiddenError()
    }

    const parsedBody = await parseJsonBody(request, createTaskRequestSchema)
    if (parsedBody.response) {
      return parsedBody.response
    }

    if (parsedBody.data.assignee_id && !findUserById(parsedBody.data.assignee_id)) {
      return validationError({ assignee_id: 'Assignee does not exist' })
    }

    const task = createTaskRecord(projectId, parsedBody.data, auth.user.id)
    return HttpResponse.json(task, { status: 201 })
  }),

  http.patch(apiUrl('/tasks/:taskId'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const taskId = String(params.taskId)
    const task = getTaskRecordById(taskId)
    if (!task) {
      return notFoundError()
    }

    if (!hasProjectAccess(auth.user.id, task.project_id)) {
      return forbiddenError()
    }

    const parsedBody = await parseJsonBody(request, updateTaskRequestSchema)
    if (parsedBody.response) {
      return parsedBody.response
    }

    if (
      parsedBody.data.assignee_id !== undefined &&
      parsedBody.data.assignee_id !== null &&
      !findUserById(parsedBody.data.assignee_id)
    ) {
      return validationError({ assignee_id: 'Assignee does not exist' })
    }

    return HttpResponse.json(updateTaskRecord(taskId, parsedBody.data))
  }),

  http.delete(apiUrl('/tasks/:taskId'), async ({ params, request }) => {
    await applyMockDelay(request)

    const forcedError = getForcedErrorResponse(request)
    if (forcedError) {
      return forcedError
    }

    const auth = requireAuth(request)
    if (auth.response) {
      return auth.response
    }

    const taskId = String(params.taskId)
    const task = getTaskRecordById(taskId)
    if (!task) {
      return notFoundError()
    }

    if (!canDeleteTask(auth.user.id, taskId)) {
      return forbiddenError()
    }

    deleteTaskRecord(taskId)
    return new HttpResponse(null, { status: 204 })
  }),
]
