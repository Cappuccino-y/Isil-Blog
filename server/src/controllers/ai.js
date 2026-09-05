const aiRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const Blog = require('../models/blog')
const User = require('../models/user')

const MAX_HISTORY = 12
const MAX_MESSAGE_CHARS = 4000
const SUMMARY_CHARS = 120
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 5 * 60 * 1000
const MAX_TOOL_ROUNDS = 2

const rateBuckets = new Map()

const SYSTEM_PROMPT = [
    '你是「Tilion · 驾月者」，LYYのspace 博客站的 AI 助手。',
    '你可以回答各类问题；当用户询问博客相关内容时，优先依据下方博客目录回答，需要全文细节时调用工具 get_blog。',
    '数学公式输出约定：行间公式使用 ```KaTeX 代码块；行内公式使用 `$$ 公式 $$`。'
].join('\n')

const TOOLS = [
    {
        type: 'function',
        function: {
            name: 'get_blog',
            description: '获取一篇博客的完整内容，仅能获取博客目录中列出的（当前用户可见的）博客。',
            parameters: {
                type: 'object',
                properties: {
                    id: {type: 'string', description: '博客 id，来自博客目录中对应条目的 id 字段'}
                },
                required: ['id']
            }
        }
    }
]

const truncate = (text, limit) =>
    text.length <= limit ? text : text.slice(0, limit - 1) + '…'

const pruneBucket = (bucket, now) => bucket.filter(ts => now - ts < RATE_WINDOW_MS)

const allowRequest = userId => {
    const now = Date.now()
    const bucket = pruneBucket(rateBuckets.get(userId) || [], now)
    rateBuckets.set(userId, bucket)
    if (bucket.length >= RATE_LIMIT) return false
    bucket.push(now)
    return true
}

const sanitizeMessages = raw => {
    if (!Array.isArray(raw)) return null
    const messages = []
    for (const item of raw) {
        if (!item || (item.role !== 'user' && item.role !== 'assistant')) continue
        if (typeof item.content !== 'string' || item.content.length > MAX_MESSAGE_CHARS) return null
        messages.push({role: item.role, content: item.content})
    }
    if (messages.length === 0) return null
    return messages
}

const visibleQuery = user => ({
    $or: [
        {visible: 'public'},
        {visible: user.name},
        {user: user._id}
    ]
})

const isVisibleTo = (blog, user) =>
    blog.visible.includes('public') ||
    blog.visible.includes(user.name) ||
    (blog.user && blog.user.id === user.id)

const buildCatalog = async user => {
    const blogs = await Blog.find(visibleQuery(user)).sort({date: -1})
    return blogs.map(blog => ({
        id: blog.id,
        title: blog.title || '',
        summary: truncate((blog.content || '').replace(/\s+/g, ' ').trim(), SUMMARY_CHARS)
    }))
}

const blogForTool = async (id, user) => {
    if (typeof id !== 'string' || id.length === 0) return {error: 'invalid blog id'}
    let blog = null
    try {
        blog = await Blog.findById(id).populate('user', {username: 1, name: 1})
    } catch (error) {
        blog = null
    }
    if (!blog || !isVisibleTo(blog, user)) return {error: 'blog not found or not visible'}
    return {
        id: blog.id,
        title: blog.title || '',
        tag: blog.tag || '',
        date: blog.date,
        author: blog.user ? blog.user.name : '',
        content: blog.content || ''
    }
}

const callMiniMax = async messages => {
    const res = await fetch(`${config.MINIMAX_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.MINIMAX_API_KEY}`
        },
        body: JSON.stringify({
            model: config.MINIMAX_MODEL,
            messages,
            tools: TOOLS,
            tool_choice: 'auto',
            thinking: {type: 'disabled'},
            max_completion_tokens: 4096
        })
    })
    if (!res.ok) {
        const detail = (await res.text()).slice(0, 300)
        throw new Error(`MiniMax API ${res.status}: ${detail}`)
    }
    const data = await res.json()
    if (data.base_resp && data.base_resp.status_code !== 0) {
        throw new Error(`MiniMax error ${data.base_resp.status_code}: ${data.base_resp.status_msg}`)
    }
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('MiniMax returned no message')
    }
    return data.choices[0].message
}

aiRouter.post('/chat', async (request, response) => {
    if (!request.token) {
        return response.status(401).json({error: 'token missing or invalid'})
    }

    let decoded
    try {
        decoded = jwt.verify(request.token, config.SECRET)
    } catch (error) {
        return response.status(401).json({error: 'token missing or invalid'})
    }
    if (!decoded.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }

    const messages = sanitizeMessages(request.body && request.body.messages)
    if (!messages) {
        return response.status(400).json({error: 'invalid messages'})
    }

    if (!config.MINIMAX_API_KEY) {
        return response.status(500).json({error: 'AI service is not configured'})
    }

    if (!allowRequest(String(decoded.id))) {
        return response.status(429).json({error: 'too many requests, please try again later'})
    }

    try {
        const user = await User.findById(decoded.id)
        if (!user) {
            return response.status(401).json({error: 'token missing or invalid'})
        }

        const catalog = await buildCatalog(user)
        const chatMessages = [
            {
                role: 'system',
                content: SYSTEM_PROMPT + '\n当前用户可见的博客目录（JSON）：\n' + JSON.stringify(catalog)
            },
            ...messages.slice(-MAX_HISTORY)
        ]

        let reply = ''
        let rounds = 0
        while (true) {
            const message = await callMiniMax(chatMessages)
            const toolCalls = Array.isArray(message.tool_calls) ? message.tool_calls : []

            if (toolCalls.length === 0) {
                reply = message.content || ''
                break
            }

            if (rounds >= MAX_TOOL_ROUNDS) {
                reply = (message.content || '').trim() || '抱歉，我暂时无法完成这个请求。'
                break
            }

            rounds += 1
            chatMessages.push({role: 'assistant', content: message.content || '', tool_calls: message.tool_calls})
            for (const call of toolCalls) {
                let args = {}
                try {
                    args = JSON.parse((call.function && call.function.arguments) || '{}')
                } catch (error) {
                    args = {}
                }
                const result = call.function && call.function.name === 'get_blog'
                    ? await blogForTool(args.id, user)
                    : {error: 'unknown tool'}
                chatMessages.push({role: 'tool', tool_call_id: call.id, content: JSON.stringify(result)})
            }
        }

        response.json({reply: reply.trim()})
    } catch (error) {
        console.error(error.message)
        response.status(502).json({error: 'AI service error'})
    }
})

module.exports = aiRouter
