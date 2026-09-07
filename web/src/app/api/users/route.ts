import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'

export async function GET() {
  await connectDB()
  const users = await User.find({}).select('username name').lean()
  return NextResponse.json(users.map((u) => ({ username: u.username, name: u.name })))
}
