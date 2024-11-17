import jwt from '@elysiajs/jwt'

export * from './prisma'

export function getExpTimestamp(seconds: number) {
  const currentTimeMillis = Date.now()
  const secondsIntoMillis = seconds * 1000
  const expirationTimeMillis = currentTimeMillis + secondsIntoMillis

  return Math.floor(expirationTimeMillis / 1000)
}

export const ACCESS_TOKEN_EXP = 5 * 60 // 5 minutes
export const REFRESH_TOKEN_EXP = 7 * 86400 // 7 days
export const JWT_NAME = 'jwt'

export const appJwt = jwt({ name: JWT_NAME, secret: Bun.env.JWT_SECRET! })
