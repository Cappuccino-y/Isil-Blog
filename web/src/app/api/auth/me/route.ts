import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { User } from '@/lib/models'
import { connectDB } from '@/lib/db'

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json(null)
  await connectDB()
  const user = await User.findById(session.id)
  if (!user) return NextResponse.json(null)
  return NextResponse.json({ username: user.username, name: user.name, id: user.id })
}
