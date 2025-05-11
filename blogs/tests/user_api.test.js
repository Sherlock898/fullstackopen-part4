const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const test_helper = require('./test_helper');

const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    for (const {username, name, password} of test_helper.initialUsers) {
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = new User({username: username, name: name, hashedPwd: hashedPwd});
        await user.save();
    }
});

test('invalid user are not created', async () => {
    const userWithSameUsername = {username: test_helper.initialUsers[0].username, name: "random", password: "valid"};
    const userWithInvalidUsername = {username: "a", name: "random", password: "valid"};
    const userWithInvalidPassword = {username: "abcd", name: "random", password: "a"};

    const res1 = await api
        .post('/api/users')
        .send(userWithSameUsername)
        .expect(400);
    assert(res1.body.error.includes('expected `username` to be unique'));

    const res2 = await api
        .post('/api/users')
        .send(userWithInvalidUsername)
        .expect(400);
    assert(res2.body.error.includes('username must be at least 3 characters long'));

    const res3 = await api
        .post('/api/users')
        .send(userWithInvalidPassword)
        .expect(400);
    assert(res3.body.error.includes('password must be at least 3 characters long'));

    const usersInDb = await test_helper.usersInDb();
    assert.strictEqual(usersInDb.length, test_helper.initialUsers.length);
});

after(async () => {
    await mongoose.connection.close();
});