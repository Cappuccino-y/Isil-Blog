const mongoose = require('mongoose')
const config = require('../config')
const logger = require('../utils/logger')

const connect = () => {
    logger.info('connecting to', config.MONGODB_URI)
    return mongoose.connect(config.MONGODB_URI)
        .then(() => {
            logger.info('connected to MongoDB')
        })
        .catch((error) => {
            logger.error('error connecting to MongoDB:', error.message)
        })
}

module.exports = connect
