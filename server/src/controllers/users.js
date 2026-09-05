const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const saltRounds = 10

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
    response.json(users)
})
usersRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// 更新密码
usersRouter.put('/:username', async (request, response, next) => {
    const passwordHash = await bcrypt.hash(request.body.newPassword, saltRounds)
    const updatedUser = await User.updateOne({username: request.params.username},
        {$set: {passwordHash: passwordHash}}
        , {new: true})
    response.json(updatedUser)
})

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({
            error: "username or password should be at least 3 words"
        })
    }

    const existingUser = await User.findOne({username})
    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter
