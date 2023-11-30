const express = require('express')
const { auth, isAuth, isAdmin, userById, productById } = require('../middleware/auth')
const productValidator = require('../validator/product')
const Product = require('../controller/product')

const router = express.Router()

// 获取商品列表
router.get('/products', Product.list)

// 新增产品
router.post('/product/create/:userId', [auth, isAuth, isAdmin], productValidator.create, Product.create)

// 根据 id 获取产品信息
router.get('/product/:productId', productValidator.read, Product.read)

// 根据 id 更新产品
router.put('/product/:productId/:userId', [auth, isAuth, isAdmin], productValidator.update, Product.update)

// 根据 id 删除产品
router.delete('/product/:productId/:userId', [auth, isAuth, isAdmin], productValidator.remove, Product.remove)

// 查找同类产品下的其他产品
router.get('/products/related/:productId', productValidator.listRelated, Product.listRelated)

// 获取产品列表中使用到的分类信息
router.get('/products/categories', Product.listCategories)

// 商品搜索
router.get('/products/search', Product.listSearch)

// 商品过滤
router.post('/products/filter', Product.listByFilter)

// 根据商品ID获取商品封面
router.get('/product/photo/:productId', Product.photo)

router.param('userId', userById)

router.param('productId', productById)

module.exports = router