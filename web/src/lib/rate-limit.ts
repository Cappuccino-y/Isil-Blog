const buckets = new Map<string, number[]>()

export function allowRequest(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = (buckets.get(key) || []).filter((ts) => now - ts < windowMs)
  buckets.set(key, bucket)
  if (bucket.length >= limit) return false
  bucket.push(now)
  return true
}

export function clientIp(req: Request) {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'local'
}
