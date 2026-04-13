import { apiRequest } from '@/lib/api-client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

export function login(input: LoginRequest) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: input,
  })
}

export function register(input: RegisterRequest) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: input,
  })
}
