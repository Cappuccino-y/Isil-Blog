require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const UPLOAD_DIR = process.env.UPLOAD_DIR || null
const MINIMAX_API_BASE = process.env.MINIMAX_API_BASE || 'https://api.minimaxi.com/v1'
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M3'

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET,
    UPLOAD_DIR,
    MINIMAX_API_BASE,
    MINIMAX_API_KEY,
    MINIMAX_MODEL
}
