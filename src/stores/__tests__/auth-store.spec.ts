import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth-store'
import { AUTH_TOKEN_KEY } from '@/constants/storageKeys'

function makeToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('auth-store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with no token when storage is empty', () => {
    const auth = useAuthStore()
    expect(auth.token).toBeNull()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('initializes token from localStorage if present', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'stored-token')
    const auth = useAuthStore()
    expect(auth.token).toBe('stored-token')
    expect(auth.isAuthenticated).toBe(true)
  })

  it('setToken stores the token in state and localStorage', () => {
    const auth = useAuthStore()
    auth.setToken('new-token')
    expect(auth.token).toBe('new-token')
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('new-token')
  })

  it('logout clears state and localStorage', () => {
    const auth = useAuthStore()
    auth.setToken('new-token')
    auth.logout()
    expect(auth.token).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('isTokenValid returns true for a token with a future exp', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const future = Math.floor(new Date('2026-06-01T00:00:00Z').getTime() / 1000)
    const auth = useAuthStore()
    auth.setToken(makeToken({ exp: future }))
    expect(auth.isTokenValid).toBe(true)
  })

  it('isTokenValid returns false for an expired token', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const past = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000)
    const auth = useAuthStore()
    auth.setToken(makeToken({ exp: past }))
    expect(auth.isTokenValid).toBe(false)
  })

  it('isTokenValid returns false when no token is set', () => {
    const auth = useAuthStore()
    expect(auth.isTokenValid).toBe(false)
  })
})
