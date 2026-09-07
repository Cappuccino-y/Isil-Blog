import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'
import { checkPassword, cookieOptions, AUTH_COOKIE, signToken } from '@/lib/auth'

export async function POST(req: Request) {
  let body: { username?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  const { username, password } = body
  if (!username || !password) {
    return NextResponse.json({ error: 'invalid username or password' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findOne({ username })
  const ok = user ? await checkPassword(password, user.passwordHash) : false
  if (!user || !ok) {
    return NextResponse.json({ error: 'invalid username or password' }, { status: 401 })
  }

  const token = signToken({ id: user._id.toString(), username: user.username })
  const res = NextResponse.json({ username: user.username, name: user.name })
  res.cookies.set(AUTH_COOKIE, token, cookieOptions)
  return res
}
