const express = require('express')
const User = require('../controller/user')
const userValidator = require('../validator/user')
const { auth, isAuth, userById } = require('../middleware/auth')

const router = express.Router();

// 根据用户id获取用户信息
router.get('/user/:userId', [auth, isAuth], userValidator.read, User.read);

// 更新用户信息 (昵称和密码)
router.put('/user/:userId', [auth, isAuth], userValidator.update, User.update);



router.param('userId', userById)

module.exports = router;