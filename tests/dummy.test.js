const listHelper = require('../utils/list_helper')

describe('Dummy returns 1',() =>{
  test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
})