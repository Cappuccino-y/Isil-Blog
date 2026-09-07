'use client'

import { useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { Check, Copy } from 'lucide-react'
import 'katex/dist/katex.min.css'

function PreWithCopy({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="group relative">
      <button
        aria-label="复制代码"
        onClick={(e) => {
          const pre = e.currentTarget.parentElement?.querySelector('pre')
          if (!pre) return
          navigator.clipboard.writeText(pre.textContent || '').then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          })
        }}
        className="absolute right-3 top-3 z-10 rounded-md border border-glass-border bg-black/30 p-1.5 text-white/60 opacity-0 transition-all hover:text-gold group-hover:opacity-100"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      {children}
    </div>
  )
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="moon-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeKatex, rehypeHighlight]}
        components={{
          pre: PreWithCopy,
          img: (props) => <img {...props} loading="lazy" alt={props.alt || ''} />,
          a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
