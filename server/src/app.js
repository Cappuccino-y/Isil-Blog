const config = require('./config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const connect = require('./db/connect')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require("./controllers/users")
const loginRouter = require('./controllers/login')
const imagesRouter = require('./controllers/images')
const middleware = require('./middleware')
const path = require('path')
const os = require('os')

connect()

app.use(cors())

// 博客图片静态服务（与 images 控制器的上传目录一致）
const imageBaseDir = config.UPLOAD_DIR || os.homedir()
app.use('/images', express.static(path.join(imageBaseDir, 'images')))

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.sessionExamine, middleware.userExtractor, blogsRouter)
app.use('/api/images', imagesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
