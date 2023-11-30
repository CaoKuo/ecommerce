const mongoose = require("mongoose")
const config = require("config")

const { dbUri } = config.get('database')

const userSchema = require('./user')
const categorySchema = require('./category')
const productSchema = require('./product')

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("数据库连接成功"))
    .catch((err) => console.error("数据库连接失败", err))

const User = mongoose.model('User', userSchema)

const Category = mongoose.model('Category', categorySchema)

const Product = mongoose.model('Product', productSchema)

module.exports = {
    User,
    Category,
    Product
}