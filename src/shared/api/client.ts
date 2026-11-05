export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(
    message: string,
    status: number,
    code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const response = await fetch(`${baseUrl}/${path.replace(/^\//, '')}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  })

  if (response.status === 204) return undefined as T

  const payload: unknown = await response.json().catch(() => undefined)
  if (!response.ok) {
    const body = typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {}
    const message = typeof body.message === 'string'
      ? body.message
      : `La API respondió con HTTP ${response.status}.`
    const code = typeof body.code === 'string' ? body.code : undefined
    throw new ApiError(message, response.status, code)
  }

  return payload as T
}

export const apiConfig = { baseUrl }
