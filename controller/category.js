const { Category, Product } = require('../model')

const creat = async (req, res, next) => {
    const category = new Category(req.body)

    try {
        await category.save();

        const categoryData = category.toObject();

        res.status(200).json({
            code: 0,
            data: categoryData,
            msg: '保存成功'
        })
    } catch (error) {
        next(error)
    }
}

const read = (req, res, next) => {
    try {
        const category = req.category;

        const categoryData = category.toObject();

        res.status(200).json({
            code: 0,
            data: categoryData,
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const category = req.category;

        category.name = req.body.name;

        await category.save();

        const categoryData = category.toObject();

        res.status(200).json({
            code: 0,
            data: categoryData,
            msg: '更新成功'
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const category = req.category;
        const categoryId = category._id;

        const product = await Product.find({ category: categoryId });

        if(product.length) {
            return res.status(400).json({
                code: -1,
                msg: `抱歉. 不能删除 ${category.name} 分类. 此分类中还有 ${product.length} 条相关产品`
            })
        } else {
            await Category.findByIdAndDelete(categoryId);

            res.status(200).json({
                code: 0,
                msg: '删除成功',
            });
        }
    } catch (error) {
        next(error)
    }
}

const list = async (req, res, next) => {
    try {
        const {
            pageNum = 1,
            pageSize = 10,
        } = req.query;

        const skipCount = (Number(pageNum) - 1) * Number(pageSize)

        const categoryQuery = Category.find()
            .skip(skipCount)
            .limit(Number(pageSize))
            .sort({
                createdAt: -1,
            });

        const [categorys, categoryCount] = await Promise.all([
            categoryQuery.exec(),
            Category.countDocuments()
        ])

        res.status(200).json({
            code: 0,
            data: {
                categorys,
                total: categoryCount
            }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    creat,
    read,
    update,
    remove,
    list,
}