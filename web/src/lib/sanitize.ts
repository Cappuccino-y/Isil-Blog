export function sanitizeMessages(raw: unknown) {
  if (!Array.isArray(raw)) return null
  const messages: { role: 'user' | 'assistant'; content: string }[] = []
  for (const item of raw) {
    if (!item || (item.role !== 'user' && item.role !== 'assistant')) continue
    if (typeof item.content !== 'string' || item.content.length > 4000) return null
    messages.push({ role: item.role, content: item.content })
  }
  if (messages.length === 0) return null
  return messages
}
