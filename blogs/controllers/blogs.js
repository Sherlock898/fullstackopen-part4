const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res, next) => {
    try{
        const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
        res.json(blogs);
    } catch (error){
        next(error);
    }
});

blogsRouter.post('/', async (req, res, next) => {
    const user = req.user;
    if(!req.user){
        return res.status(401).json({error: 'authentication required'});
    }

    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
        user: user._id
    });

    try {
        const newBlog = await blog.save();
        user.blogs = user.blogs.concat(newBlog._id);
        await user.save();
        res.status(201).json(newBlog);
    } catch (error) {
        next(error);
    }
});

blogsRouter.delete('/:id', async (req, res, next) => {
    try{
        const user = req.user;
        if (!req.user) {
            return res.status(401).json({ error: 'authentication required' });
        }

        const id = req.params.id;
        const blogToDelete = await Blog.findById(id);
        if(!blogToDelete){
            res.status(204).end();
        }

        if(user._id.toString() !== blogToDelete.user.toString()){
            return res.status(401).json({error: "User id does not match blog creator's id"});
        }

        await blogToDelete.deleteOne()
        user.blogs = user.blogs.filter(blog => blog._id.toString != blogToDelete._id.toString())

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

blogsRouter.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        let blog = await Blog.findById(id);
        if(body.title) blog.title = body.title;
        if(body.author) blog.author = body.author;
        if(body.url) blog.url = body.url;
        if(body.likes) blog.likes = body.likes;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogsRouter;