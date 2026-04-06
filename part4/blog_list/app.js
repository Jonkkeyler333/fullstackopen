const express = require('express')
const mongoose = require('mongoose')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoUrl = config.mongoURL

mongoose.connect(mongoUrl, { family: 4 }).then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

module.exports = app