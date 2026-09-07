import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export const AUTH_COOKIE = 'isil_token'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export interface SessionUser {
  id: string
  username: string
}

export function signToken(user: SessionUser) {
  return jwt.sign({ username: user.username, id: user.id }, secret(), {
    expiresIn: MAX_AGE_SECONDS,
  })
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, secret()) as { id?: string; username?: string }
    if (!decoded.id) return null
    return { id: decoded.id, username: decoded.username as string }
  } catch {
    return null
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE_SECONDS,
  secure: process.env.ISIL_COOKIE_SECURE === 'true',
}

export async function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

function secret() {
  const s = process.env.SECRET
  if (!s) throw new Error('SECRET is not configured')
  return s
}
