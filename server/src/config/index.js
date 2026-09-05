require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const UPLOAD_DIR = process.env.UPLOAD_DIR || null

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET,
    UPLOAD_DIR
}
