interface JwtPayload {
  exp: number
  [key: string]: unknown
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function isJwtValid(token: string | null): boolean {
  if (!token) return false
  const payload = decodeJwt(token)
  if (!payload) return false
  return payload.exp * 1000 > Date.now()
}
