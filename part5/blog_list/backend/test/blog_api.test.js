const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let testToken = null
let testUser = null
beforeEach(async () => {
    if (!testToken){
        await User.deleteMany({})
        const user = {
            username: 'keyler',
            name: 'keyler',
            password: 'hola'
        }
        const responseUser = await api
          .post('/api/users')
          .send(user)
        testUser = responseUser.body
        const responseLogin = await api
          .post('/api/login')
          .send(user)
        testToken = responseLogin.body.token
        console.log('token generated')
    }
    await Blog.deleteMany({})
    console.log('cleaned')
    await Blog.insertMany(helper.initialBlogs)
    console.log('added')
})

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have the attribute id', async () => {
    const blogObjects = await api.get('/api/blogs')
    assert(blogObjects.body.every(blog => blog.id !== undefined))
})

test('blogs are added successfully', async () => {
//    const newBlogObjects = helper.newBlogs.map((blog) => new Blog(blog))
//    const promiseBlogs = newBlogObjects.map((element) => element.save())
//    const savedBlogs = await Promise.all(promiseBlogs)
//    savedBlogs.forEach((blog, i) => {
//     assert.strictEqual(blog.title, helper.newBlogs[i].title)
//    }) 
    let response = await api.post('/api/blogs').set('Authorization', `Bearer ${testToken}`).send(helper.newBlogs[0])
    let notesAtEnd = await helper.notesInDb()
    assert.deepStrictEqual(response.body.title, helper.newBlogs[0].title)
    assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)
    response = await api.post('/api/blogs').set('Authorization', `Bearer ${testToken}`).send(helper.newBlogs[1])
    notesAtEnd = await helper.notesInDb()
    assert.deepStrictEqual(response.body.title, helper.newBlogs[1].title)
    assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 2)
})

test('if likes is missing, it will default to 0', async () => {
    const newBlog = {
        title: 'Java is dead',
        author: 'keyler',
        url: 'https://hi.com'
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${testToken}`).send(newBlog)
    assert.strictEqual(response.body.likes, 0)
})

test('if the title is missing, the backend returns error', async () => {
    const newBlog = {
        author: 'keyler',
        url: 'https://hi.com',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken}`)    
        .send(newBlog)
        .expect(400)
})

test('if the url is missing, the backend returns error', async () => {
    const newBlog = {
        author: 'keyler',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newBlog)
        .expect(400)
})


describe('deletion of a note', () => {
    test('succeeds with status code 204 if the id is valid', async () => {
        await Blog.deleteMany({})
        const notesAtBegin = await helper.notesInDb()
        const note = {
            title: 'El viejo macdonal',
            author: 'keyler',
            url: 'https://hi.com',
            likes: 1
        }
        const response = await api.post('/api/blogs').set('Authorization', `Bearer ${testToken}`).send(note)
        await api.delete(`/api/blogs/${response.body.id}`).set('Authorization', `Bearer ${testToken}`).expect(204)
        const notesAtEnd = await helper.notesInDb()
        const ids = notesAtEnd.map(note => note.id)
        assert(!ids.includes(response.body.id))
        assert.strictEqual(notesAtBegin.length, notesAtEnd.length)
    })
})

describe('update a note', () => {
    test('succeeds with a status code 200 if update the likes of a note if the id is valid', async () => {
        const notesAtBegin = await helper.notesInDb()
        const noteBegin = notesAtBegin[0]
        let newLikes = 200
        const noteUpdated = await api.put(`/api/blogs/${noteBegin.id}`).send({'likes': newLikes})
        assert.notStrictEqual(noteUpdated.body.likes, noteBegin.likes)
        assert.strictEqual(noteUpdated.body.title, noteBegin.title)
    })
    test('succeeds with a status code 200 if update the title of a note if the id is valid', async () => {
        const notesAtBegin = await helper.notesInDb()
        const noteBegin = notesAtBegin[0]
        let newTitle = 'El viejo macdonal'
        const noteUpdated = await api.put(`/api/blogs/${noteBegin.id}`).send({'title': newTitle})
        assert.strictEqual(noteUpdated.body.likes, noteBegin.likes)
        assert.notStrictEqual(noteUpdated.body.title, noteBegin.title)
    })
})

describe('when there is initially one user in db', () => {
   beforeEach(async () => {
       await User.deleteMany({})
       console.log('cleaned users')
       await User.insertMany(helper.initialUser)
       console.log('added users')
   })
   test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.userInDb()
      const newUser = {
          username: 'keyler2',
          name: 'keyler2',
          password: 'hola'
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.userInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })
    test('creation fails with proper status code and message if the username is to short', async () => {
        const usersAtStart = await helper.userInDb()
        const newUser = {
            username: 'hol',
            name: 'fake',
            password: 'xd'
        } 
        const result = await api
           .post('/api/users')
           .send(newUser)
           .expect(400)
        
        const usersAtEnd = await helper.userInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        console.log(result.body.error)
        assert(result.body.error.includes('username or password is invalid'))
    })
    test('blog creation fails if the token is not provided', async () => {
        const newBlog = {
            title: 'El viejo macdonal',
            author: 'keyler',
            url: 'https://hi.com',
            likes: 1
        }
        await api.post('/api/blogs').send(newBlog).expect(401)
    })
})

after(async () => {
  await mongoose.connection.close()
})