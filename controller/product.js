const _ = require("lodash")
const fs = require('fs')
const path = require('path')
const { Product } = require('../model')
const multer = require('multer');
const { query } = require("express");
const upload = multer({ dest: 'uploads/' });

const create = (req, res, next) => {
    try {
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                res.status(400).json({
                    code: -1,
                    msg: '图片上传失败'
                })
                return;
            }

            console.log("Fields:", req.body); // 表单字段
            console.log("File:", req.file); // 上传的文件信息

            const { name, description, price, category, quantity, shipping } = req.body;

            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({
                    code: -1,
                    msg: '缺少必填字段'
                });
            }

            if(req.file && req.file.size > 1024 * 1024 * 1) {
                return res.status(400).json({
                    code: -1,
                    msg: '图片大于了1MB'
                })
            }

            const content = {
                name,
                description,
                price,
                category,
                quantity,
                shipping,
                // 处理上传的文件信息
                photo: {
                    data: fs.readFileSync(req.file.path),
                    contentType: req.file.mimetype,
                },
            }

            const product = new Product(content);

            await product.populate('category');

            await product.save();

            const productData = product.toObject();

            res.status(200).json({
                code: 0,
                data: productData
            });
        })
    } catch (error) {
        next(error)
    }
}

const list = async (req, res, next) => {
    try {
        const order = req.query.order === 'desc' ? 'desc' : 'asc';
        const sortBy = req.query.sortBy || '_id';

        const pageNum = parseInt(req.query.pageNum) || 1;
        const pageSize = parseInt(req.query.pageSize) || 6;

        if (![ 'desc', 'asc' ].includes(order)) {
            return res.status(400).json({
                code: -1,
                msg: '请检查升降序参数'
            });
        }

        const skipCount = (pageNum - 1) * pageSize;

        let productQuery = Product.find()
            .select('-photo')
            .skip(skipCount)
            .populate('category')
            .sort({
                [sortBy]: order
            })
            .limit(pageSize)

        const [products, productCount] = await Promise.all([
            productQuery.exec(),
            Product.countDocuments()
        ])

        res.status(200).json({
            code: 0,
            data: {
                products,
                total: productCount
            }
        })
    } catch (error) {
        next(error)
    }
}

const read = (req, res, next) => {
    try {
        const product = req.product;

        product.photo = undefined;

        res.status(200).json({
            code: -1,
            data: {
                product,
            }
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const productId = req.product._id;

        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            code: 0,
            msg: '产品删除成功'
        })
    } catch (error) {
        next(error)
    }
}

const update = (req, res, next) => {
    try {
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                res.status(400).json({
                    code: -1,
                    msg: '图片上传失败'
                })
                return;
            }

            let product = req.product;
 
            product = _.extend(product, req.body);
            
            if(req.file && req.file.size > 1024 * 1024 * 1) {
                return res.status(400).json({
                    code: -1,
                    msg: '图片大于了1MB'
                })
            }

            product.photo.data = fs.readFileSync(req.file.path);
            product.photo.contentType = req.file.mimetype;

            await product.populate('category');

            await product.save();

            res.status(200).json({
                code: 0,
                data: product.toObject()
            })
        })
    } catch (error) {
        next(error)
    }
}

const listRelated = async (req, res, next) => {
    try {
        const pageNum = parseInt(req.query.pageNum) || 1;
        const pageSize = parseInt(req.query.pageSize) || 6;

        const skipCount = (pageNum - 1) * pageSize;

        // 构建筛选条件，用于查询相关产品
        const filter = {
            _id: { $ne: req.product._id }, // 排除当前产品
            category: req.product.category, // 匹配同一类别的产品
        };


        let productQuery = Product.find(filter)
            .skip(skipCount)
            .limit(pageSize)
            .populate('category', '_id name')

        const [products, productCount] = await Promise.all([
            productQuery.exec(),
            Product.countDocuments(filter)
        ])

        if(!products) {
            return res.status(400).json({
                code: -1,
                msg: '没有相关产品'
            })
        }

        res.status(200).json({
            code: 0,
            data: {
                products,
                total: productCount,
            }
        })
    } catch (error) {
        next(error);
    }
}

const listCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category', {});

        if(!categories.length) {
            return res.status(400).json({
                code: -1,
                msg: '没找到分类'
            })
        }

        res.status(200).json({
            code: 0,
            data: {
                categories
            }
        })
    } catch (error) {
        next(error)
    }
}

const listByFilter = async (req, res, next) => {
    try {
        const order = req.query.order === 'desc' ? 'desc' : 'asc';
        const sortBy = req.query.sortBy || '_id';

        const pageNum = parseInt(req.query.pageNum) || 1;
        const pageSize = parseInt(req.query.pageSize) || 6;

        if (![ 'desc', 'asc' ].includes(order)) {
            return res.status(400).json({
                code: -1,
                msg: '请检查升降序参数'
            });
        }

        const skipCount = (pageNum - 1) * pageSize;

        let fliter = {}

        for(let key in req.body.filters) {
            if(req.body.filters[key].length > 0) {
                if(key == 'price') {
                    fliter[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.ffilters[key][1]
                    }
                } else {
                    fliter[key] = req.body.filters[key]
                }
            }
        }

        let productQuery = Product.find(fliter)
            .select('-photo')
            .populate('category')
            .sort({
                [sortBy]: order
            })
            .skip(skipCount)
            .limit(pageSize)
        
        const [products, productCount] = await Promise.all([
            productQuery.exec(),
            Product.countDocuments(fliter)
        ])

        res.status(200).json({
            code: 0,
            data: {
                products,
                total: productCount
            }
        })
    } catch (error) {
        next(error)
    }
}

const listSearch = async (req, res, next) => {
    try {
        let fliter = {}
        if(req.query.search) {
            fliter.name = {
                $regex: req.query.search,
                $options: 'i'
            }
        }

        if(req.query.category && req.query.category !== 'All') {
            fliter.category = req.query.category;
        }

        const products = await Product.find(fliter).select('-photo').populate('category');

        res.status(200).json({
            code: 0,
            data: {
                products
            }
        })
    } catch (error) {
        next(error)
    }
}

const photo = async (req, res, next) => {
    try {
        const product = req.product;
        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType)
            res.status(200).json({
                code: 0,
                data: product.photo.data
            })
        } else {
            res.status(400).json({
                code: -0,
                msg: '图片内容为空'
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    create,
    list,
    read,
    update,
    remove,
    listRelated,
    listCategories,
    listByFilter,
    listSearch,
    photo,
}