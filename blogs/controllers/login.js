const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        const passwordCorrect = user === null ? false : bcrypt.compare(password, user.hashedPwd);
        if(!user || !passwordCorrect){
            return res.status(401).json({error: 'invalid username or password'});
        }

        const userForToken = {
            username: user.username,
            id: user._id
        };

        const token = jwt.sign(userForToken, process.env.SECRET);

        res.status(200).send({token, username: user.name, name: user.name});
    } catch (error) {
        next(error);
    }
});

module.exports = loginRouter;