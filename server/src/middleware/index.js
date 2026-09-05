const jwt = require('jsonwebtoken')
const config = require('../config')

const requestLogger = (request, response, next) => {
    console.info('Method:', request.method)
    console.info('Path:  ', request.path)
    console.info('Body:  ', request.body)
    console.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        request.token = null
    }
    next()
}

const userExtractor = (request, response, next) => {
    const token = request.token
    if (token != null) {
        const decodedToken = jwt.verify(token, config.SECRET)
        request.user = decodedToken.username
    } else {
        request.user = null
    }

    next()
}

const sessionExamine = (req, res, next) => {
    if (!req.token) return res.status(400).send({error: 'session missing'})
    jwt.verify(req.token, config.SECRET, (error, user) => {
        if (error) return res.status(400).send({error: 'session expired'})
        else next()
    })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    sessionExamine,
    unknownEndpoint,
    errorHandler
}
