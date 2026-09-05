const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    tag: String,
    likes: Number,
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    visible: [
        String
    ],
    comments: [
        {
            name: String,
            content: String,
            id: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
