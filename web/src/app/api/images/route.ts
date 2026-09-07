import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { getSessionUser } from '@/lib/auth'

const MAX_SIZE = 5 * 1024 * 1024
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
}

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'invalid form data' }, { status: 400 })
  }
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'file too large (max 5MB)' }, { status: 400 })
  }
  const ext = EXT_BY_MIME[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'unsupported image type' }, { status: 400 })
  }

  const baseDir = process.env.UPLOAD_DIR || os.homedir()
  const dir = path.join(baseDir, 'images', session.username)
  await fs.mkdir(dir, { recursive: true })
  const filename = `${path.parse(file.name || 'image').name.replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 60) || 'image'}-${Date.now()}${ext}`
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({
    success: true,
    imageUrl: `/images/${session.username}/${filename}`,
  })
}
