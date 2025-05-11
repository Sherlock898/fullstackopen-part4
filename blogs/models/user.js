const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: (val) => val.length >= 3,
            message: 'username must be at least 3 characters long',
        },
        unique: true
    },
    name: {type: String, required: true},
    hashedPwd: {type: String, required: true},
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.hashedPwd;
    }
});

module.exports = mongoose.model('User', userSchema);