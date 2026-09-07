import { NextResponse } from 'next/server'
import { createReadStream, promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { Readable } from 'stream'

type Params = { params: Promise<{ path: string[] }> }

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

export async function GET(_req: Request, { params }: Params) {
  const { path: segments } = await params
  if (!segments?.length || segments.some((s) => !s || s === '.' || s === '..')) {
    return new NextResponse(null, { status: 400 })
  }
  const baseDir = process.env.UPLOAD_DIR || os.homedir()
  const root = path.join(baseDir, 'images')
  const target = path.resolve(root, ...segments)
  if (!target.startsWith(path.resolve(root) + path.sep)) {
    return new NextResponse(null, { status: 400 })
  }
  try {
    const stat = await fs.stat(target)
    if (!stat.isFile()) return new NextResponse(null, { status: 404 })
    const ext = path.extname(target).toLowerCase()
    const stream = Readable.toWeb(createReadStream(target)) as ReadableStream
    return new NextResponse(stream, {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
