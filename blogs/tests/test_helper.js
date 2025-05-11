const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
    {
        "title": "1984",
        "author": "pepe",
        "url": "goku1.com",
        "likes": 5,
    },
    {
        "title": "1985",
        "author": "pepe",
        "url": "goku.com",
        "likes": 4,
    },
    {
        "title": "1986",
        "author": "sech",
        "url": "goku2.com",
        "likes": 6,
    }
];

const initialUsers = [
    {
        "username": "pepe1",
        "name": "pepe2",
        "password": "pepe3"
    },
    {
        "username": "sech1",
        "name": "sech2",
        "password": "sech3"
    }
];

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
}

module.exports = {initialBlogs, initialUsers, blogsInDb, usersInDb};