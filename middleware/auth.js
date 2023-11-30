const { User, Category, Product } = require("../model");
const { verify } = require("../util/jwt");

const auth = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(200).json({
            code: 401,
            msg: '当前用户无权限',
        });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        const decodedToken = await verify(token, jwtSecret);

        const currentTime = Date.now();
        const tokenExpiration = decodedToken.exp * 1000;
        const minimumValidity = 60 * 60 * 1000;

        const user = await User.findById(decodedToken.userId);

        if(!user) {
            return res.status(200).json({
                code: 401,
                msg: '当前用户无权限',
            });
        }

        if(tokenExpiration - currentTime < minimumValidity) {
            const newToken = await sign(
                { userId: user._id },
                jwtSecret,
                { expiresIn: '1d' },
            );

            res.cookie('token', newToken, { httpOnly: true });
        }

        req.auth = user;
        next();
    } catch (error) {
        return res.status(200).json({
            code: 401,
            msg: '当前用户无权限',
        });
    }
}

const isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth.id;
    if (!user) {
        return res.status(403).json({
            code: 403,
            msg: "权限不足"
        })
    }
    next()
}

const isAdmin = (req, res, next) => {
    if(req.profile.role == 0) {
        return res.status(403).json({
            code: 403,
            msg: '只有管理员才可以访问'
        })
    }
    next();
}

const userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id)

        if(!user) {
            res.status(400).json({
                code: -1,
                msg: '用户没找到'
            })
        }

        req.profile = user;

        next();
    } catch (error) {
        next(error);
    }
}

const categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id);

        if(!category) {
            res.status(400).json({
                code: -1,
                msg: '分类不存在'
            })
        }

        req.category = category;

        next();
    } catch (error) {
        next(error);
    }
}

const productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id);

        if(!product) {
            res.status(400).json({
                code: -1,
                msg: '产品不存在'
            })
        }

        req.product = product;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    auth,
    isAuth,
    isAdmin,
    userById,
    categoryById,
    productById,
};