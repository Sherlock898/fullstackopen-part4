const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res, next) => {
    try{
        const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1});
        res.json(users);
    } catch (error) {
        next(error)
    }
});

usersRouter.post('/', async (req, res, next) => {
    try {
        const {username, name, password} = req.body;
        if(!password || password.length < 3){            
            res.status(400).json({error: 'password must be at least 3 characters long'});
        }
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = new User({username: username, name: name, hashedPwd: hashedPwd});
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;