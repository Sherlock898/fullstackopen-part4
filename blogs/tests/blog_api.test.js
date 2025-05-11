const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const user1 = new User({username: 'test', name: 'a', hashedPwd: await bcrypt.hash('test', 10)});
    const user2 = new User({username: 'test2', name: 'a', hashedPwd: await bcrypt.hash('test', 10)});
    await user1.save();
    await user2.save();
    for(let blog of helper.initialBlogs){
        blog.user = user1._id;
        const newBlog = new Blog(blog);
        await newBlog.save();
    }
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
});

test.only('All blogs are returned as json', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;
    const response = await api
        .get('/api/blogs')
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test.only('The unique identifier of blogs is named id and not _id', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const response = await api.get('/api/blogs').set('Authorization', token);
    const blog = response.body[0];
    assert('id' in blog);
    assert(!('_id' in blog));
});

test.only('Post request successfully creates new blog', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const newBlog = {
        "title": "1",
        "author": "2",
        "url": "3",
        "likes": 4
    };

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    const createdBlog = response.body;

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);

    const newBlogInDb = await Blog.findById(createdBlog.id);
    assert.strictEqual(newBlogInDb.title, newBlog.title);
});

test.only('If likes is missing it sets to 0', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const newBlog = {
        "title": "1",
        "author": "2",
        "url": "3"
    };

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const createdBlog = response.body;

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);

    const newBlogInDb = await Blog.findById(createdBlog.id);
    assert.strictEqual(newBlogInDb.likes, 0);
});

test.only('If title of url is missing response with 400', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const blogWithNoTitle = {
        "author": "2",
        "url": "3",
        "likes": 5
    };

    const blogWithNoUrl = {
        "title": "1",
        "author": "2",
        "likes": 5
    };

    await api
        .post('/api/blogs')
        .send(blogWithNoTitle)
        .set('Authorization', token)
        .expect(400);

    await api
        .post('/api/blogs')
        .send(blogWithNoUrl)
        .set('Authorization', token)
        .expect(400);
});

test.only('Delete a blog', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(204);

    const blogsAtTheEnd = await helper.blogsInDb();
    assert(!blogsAtTheEnd.some(blog => blog.id === blogToDelete.id));
    assert.strictEqual(blogsAtTheEnd.length, blogsAtStart.length - 1);
});

test.only('Can not delete a blog of other user', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test2', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(401);

    const blogsAtTheEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtTheEnd.length, blogsAtStart.length);
});

test.only('Update a blog', async () => {
    const userLogin = await api.post('/api/login').send({username: 'test', password: 'test'});
    const token = 'Bearer ' + userLogin.body.token;

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const update = {author: 'abc', title: 'def', url: 'ghi', likes: 99};
    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    const updatedBlog = response.body;
    assert.strictEqual(updatedBlog.author, update.author);
    assert.strictEqual(updatedBlog.title, update.title);
    assert.strictEqual(updatedBlog.url, update.url);
    assert.strictEqual(updatedBlog.likes, update.likes);
});

after(async () => {
    await mongoose.connection.close();
});