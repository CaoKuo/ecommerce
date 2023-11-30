const express = require('express');
const auth = require('./auth')
const category = require('./category')
const product = require('./product')
const user = require('./user')

const router = express.Router();

router.use(auth);

router.use(category);

router.use(product);

router.use(user); 

module.exports = router;