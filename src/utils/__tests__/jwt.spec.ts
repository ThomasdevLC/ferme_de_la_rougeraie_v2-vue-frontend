import { describe, it, expect, vi, afterEach } from 'vitest'
import { decodeJwt, isJwtValid } from '@/utils/jwt'

function makeToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('decodeJwt', () => {
  it('decodes a valid JWT payload', () => {
    const token = makeToken({ exp: 1234, sub: 'user-1' })
    expect(decodeJwt(token)).toEqual({ exp: 1234, sub: 'user-1' })
  })

  it('returns null for a malformed token', () => {
    expect(decodeJwt('not-a-jwt')).toBeNull()
  })

  it('returns null for a token with invalid base64 payload', () => {
    expect(decodeJwt('header.@@@.sig')).toBeNull()
  })
})

describe('isJwtValid', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false for a null token', () => {
    expect(isJwtValid(null)).toBe(false)
  })

  it('returns false for a malformed token', () => {
    expect(isJwtValid('garbage')).toBe(false)
  })

  it('returns true for a token whose exp is in the future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const future = Math.floor(new Date('2026-01-02T00:00:00Z').getTime() / 1000)
    expect(isJwtValid(makeToken({ exp: future }))).toBe(true)
  })

  it('returns false for a token whose exp is in the past', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const past = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000)
    expect(isJwtValid(makeToken({ exp: past }))).toBe(false)
  })
})
