import { env } from '@/config/env'
import type { ApiErrorResponse } from '@/types'

type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown
  headers?: HeadersInit
  token?: string | null
}

type ErrorRecord = Record<string, unknown>

function isErrorRecord(value: unknown): value is ErrorRecord {
  return typeof value === 'object' && value !== null
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isErrorRecord(value) || typeof value.error !== 'string') {
    return false
  }

  if (value.error === 'validation failed') {
    return isErrorRecord(value.fields)
  }

  return ['unauthorized', 'forbidden', 'not found'].includes(value.error)
}

function getErrorMessage(status: number, data: ApiErrorResponse | null) {
  if (!data) {
    return `Request failed with status ${status}`
  }

  if (data.error === 'validation failed') {
    return 'Validation failed'
  }

  return data.error
}

export class ApiClientError extends Error {
  status: number
  data: ApiErrorResponse | null

  constructor(status: number, data: ApiErrorResponse | null) {
    super(getErrorMessage(status, data))
    this.name = 'ApiClientError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest<TResponse>(
  pathname: string,
  options: ApiRequestOptions = {},
) {
  const headers = new Headers(options.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(`${env.apiBaseUrl}${pathname}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  let responseData: unknown = null

  if (response.status !== 204) {
    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }
  }

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      isApiErrorResponse(responseData) ? responseData : null,
    )
  }

  return responseData as TResponse
}
