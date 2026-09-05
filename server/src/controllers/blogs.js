const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({})
        .populate('user', {username: 1, name: 1})
    // .sort({date: -1});
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog
        .find({id: request.params.id}).populate('user', {username: 1, name: 1})
    response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const token = request.token
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        content: body.content,
        tag: body.tag,
        user: user._id,
        comments: body.comments,
        visible: body.visible
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(await savedBlog.populate('user', {username: 1, name: 1}))
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id).populate('user')

    const token = request.token
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }
    if (decodedToken.id != blog.user.id) {
        return response.status(401).json({error: 'no permission to delete the blog'})
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
        ...request.body,
        user: request.body.user.id
    }, {new: true})
    response.json(await updatedBlog.populate('user', {username: 1, name: 1}))
})

module.exports = blogsRouter
