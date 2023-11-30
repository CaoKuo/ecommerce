const mongoose = require('mongoose');
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 4,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        trim: true,
    },
    salt: {
        type: String,
    },
    role: {
        type: Number,
        default: 0,
    },
    history: {
        type: Array,
        default: []
    }
}, { timestamps: true })

userSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    // 验证密码
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    // 密码加密
    encryptPassword: function (password) {
        if(!password) {
            return ''
        }
        try {
            return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
        } catch (error) {
            return ''
        }
    }
}

module.exports = userSchema;