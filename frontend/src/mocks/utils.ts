import { HttpResponse, delay } from 'msw'
import { z } from 'zod'

import { env } from '@/config/env'
import { findUserByToken, type MockUserRecord } from '@/mocks/data'
import type { FieldErrors } from '@/types'

const normalizedApiBaseUrl = env.apiBaseUrl.replace(/\/$/, '')

export type AuthResult =
  | { user: MockUserRecord; response?: never }
  | { user?: never; response: Response }

export function apiUrl(pathname: string) {
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${normalizedApiBaseUrl}${normalizedPathname}`
}

export async function applyMockDelay(request: Request) {
  const url = new URL(request.url)
  const requestedDelay =
    request.headers.get('x-mock-delay') ?? url.searchParams.get('mockDelay')
  const explicitDelay = requestedDelay ? Number(requestedDelay) : Number.NaN

  if (Number.isFinite(explicitDelay) && explicitDelay >= 0) {
    await delay(explicitDelay)
    return
  }

  await delay(250 + Math.floor(Math.random() * 600))
}

export function validationError(fields: FieldErrors) {
  return HttpResponse.json(
    {
      error: 'validation failed',
      fields,
    },
    { status: 400 },
  )
}

export function unauthorizedError() {
  return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
}

export function forbiddenError() {
  return HttpResponse.json({ error: 'forbidden' }, { status: 403 })
}

export function notFoundError() {
  return HttpResponse.json({ error: 'not found' }, { status: 404 })
}

export function getForcedErrorResponse(request: Request) {
  const url = new URL(request.url)
  const forcedError =
    request.headers.get('x-mock-error') ?? url.searchParams.get('mockError')

  switch (forcedError) {
    case '400':
    case 'validation':
      return validationError({ request: 'Forced mock validation error' })
    case '401':
    case 'unauthorized':
      return unauthorizedError()
    case '403':
    case 'forbidden':
      return forbiddenError()
    case '404':
    case 'not-found':
      return notFoundError()
    default:
      return null
  }
}

export function requireAuth(request: Request): AuthResult {
  const authorization = request.headers.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return { response: unauthorizedError() }
  }

  const token = authorization.slice('Bearer '.length).trim()
  const user = findUserByToken(token)

  if (!user) {
    return { response: unauthorizedError() }
  }

  return { user }
}

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<
  | { data: z.infer<T>; response?: never }
  | { data?: never; response: Response }
> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return {
      response: validationError({ body: 'Request body must be valid JSON' }),
    }
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      response: validationError(zodIssuesToFieldErrors(result.error)),
    }
  }

  return { data: result.data }
}

export function parseSearchParams<T extends z.ZodType>(
  request: Request,
  schema: T,
):
  | { data: z.infer<T>; response?: never }
  | { data?: never; response: Response } {
  const url = new URL(request.url)
  const rawParams = Object.fromEntries(url.searchParams.entries())
  const result = schema.safeParse(rawParams)

  if (!result.success) {
    return {
      response: validationError(zodIssuesToFieldErrors(result.error)),
    }
  }

  return { data: result.data }
}

function zodIssuesToFieldErrors(error: z.ZodError): FieldErrors {
  return error.issues.reduce<FieldErrors>((fields, issue) => {
    const key = issue.path[0]?.toString() ?? 'body'
    if (!fields[key]) {
      fields[key] = issue.message
    }
    return fields
  }, {})
}
