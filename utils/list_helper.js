const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {

  return blogs.map(blog => blog.likes).reduce((sum, blog) => blog + sum )

}


const favoriteBlog = (blogs) => {
  const blogMaxLikes = blogs.find( blog => blog.likes == Math.max(...blogs.map(blog => blog.likes)))
  delete blogMaxLikes.__v
  delete blogMaxLikes._id 
  delete blogMaxLikes.url

  return blogMaxLikes
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}