const express = require('express')
const authValidator = require('../validator/auth')
const Auth = require('../controller/auth')

const router = express.Router();

router.post('/signup', authValidator.signUp, Auth.signUp)

router.post('/signin', authValidator.signIn, Auth.signIn)

router.get('signout', Auth.signOut)

module.exports = router