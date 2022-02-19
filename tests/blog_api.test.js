const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('API testing' , () => {
test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)


test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)


test('id attribute exists in model', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.map(content => content.id)).toBeDefined()
}, 100000)


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Michael',
    url:'http',
    likes: 9
}

  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  const response = await helper.blogInDB()
  expect(response).toHaveLength(helper.initialBlogs.length + 1) 

})


test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'Michael',
    likes:10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await helper.blogInDB()
  expect(response).toHaveLength(helper.initialBlogs.length)

})


test('likes attribute to be defaulted as 0', async () => {
  const newBlog = {
    title: 'test',
    author: 'test',
    url:'https'
  }

  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  const response = await helper.blogInDB()
  expect(response[helper.initialBlogs.length].likes).toEqual(0)

})

})


describe('API deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogInDB()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})



afterAll(() => {
  mongoose.connection.close()
})




