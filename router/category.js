const express = require('express')
const { auth, isAuth, isAdmin, userById, categoryById } = require('../middleware/auth')
const Category = require('../controller/category')
const categoryValidator = require('../validator/catejory')

const router = express.Router()

// 创建分类
router.post('/category/create/:userId', [auth, isAuth, isAdmin], categoryValidator.creat, Category.creat)

// 根据 id 获取分类
router.get('/category/:categoryId', auth, categoryValidator.read, Category.read)

// 根据 id 更新分类
router.put('/category/:categoryId/:userId', [auth, isAuth, isAdmin], categoryValidator.update, Category.update)

// 根据 ID 删除分类
router.delete('/category/:categoryId/:userId', [auth, isAuth, isAdmin], categoryValidator.remove, Category.remove)

// 获取分类列表
router.get('/categories', Category.list)

router.param('userId', userById)

router.param('categoryId', categoryById)

module.exports = router