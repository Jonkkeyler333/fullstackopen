const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
   const users = await User.find({}).populate('blogs',{ title: 1, author: 1, url: 1, id: 1})
   response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
   const { username, name, password} = request.body
   if (!username || !password){
      response.status(400).json({error: 'username or password is invalid'})
      return
   }
   if (username.length < 3 || password.length < 3){
      response.status(400).json({error: 'username or password is invalid'})
      return
   }
   const saltRounds = 10
   const hashedPassword = await bcrypt.hash(password, saltRounds)
   const user = new User({
      username,
      name,
      passwordHash: hashedPassword
   })
   const savedUser = await user.save()

   response.status(201).json(savedUser)
})

module.exports = usersRouter
