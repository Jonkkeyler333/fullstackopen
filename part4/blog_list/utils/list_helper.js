const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const result = blogs.reduce((total, blog) => total + blog.likes, 0) 
    return result
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0){
        return {}
    }
    const authors = _.countBy(blogs, 'author')
    const [author, counts] = _.maxBy(_.toPairs(authors), ([,count]) => count)
    return { author, blogs: counts }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0){
        return {}
    }
    groupedAuthors = _.groupBy(blogs, 'author')
    likesAuthor = _.mapValues(groupedAuthors, (blogsArray) => _.sumBy(blogsArray, 'likes'))
    const [author, likes] = _.maxBy(_.toPairs(likesAuthor), ([,likes]) => likes)
    return { author, likes }
}

const favoriteBlog = (blogs) => blogs.reduce( (favorite, blog) => favorite.likes > blog.likes ? favorite : blog, {})

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }