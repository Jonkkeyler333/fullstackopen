const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/api/blogs', async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/api/blogs',middleware.userExtractor, async (request, response) => {
  // const blog = new Blog(request.body)
  // blog.save()
  // .then((result) => {
  //   response.status(201).json(result)
  // })
  // .catch((error) => response.status(400).json({ error: error.message }))
  const {title, author, url, likes} = request.body
  // const token = request.token
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // if (!decodedToken.id){
  //   return reponse.status(401).json({error: 'invalid token'})
  // }
  // const user = await User.findById(decodedToken.id)
  const user = request.user
  if (!user){
    return reponse.status(401).json({error: 'invalid credentials'})
  }
  try {
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'ValidationError'){
      response.status(400).json({ error: 'missing field'})
      return
    }
  }
})

blogsRouter.delete('/api/blogs/:id', middleware.userExtractor, async (request, response) => {
  // const token = request.token
  // if (!token){
  //   return response.status(400).json({error: 'Invalid credentials'})
  // }
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // const user = await User.findById(decodedToken.id)
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if(!(blog.user.toString() === user.id )){
    return response.status(400).json({error: 'unauthorized action'})
  }
  await Blog.findOneAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const id = request.params.id
  const blogDataUpdate = request.body
  const blogObject = await Blog.findById(id)
  if (!blogObject){
    return response.status(404).end()
  }
  blogObject.title = blogDataUpdate.title ?? blogObject.title
  blogObject.author = blogDataUpdate.author ?? blogObject.author
  blogObject.url = blogDataUpdate.url ?? blogObject.url
  blogObject.likes = blogDataUpdate.likes ?? blogObject.likes

  const updatedBlog = await blogObject.save()
  return response.json(updatedBlog)
})

module.exports = blogsRouter