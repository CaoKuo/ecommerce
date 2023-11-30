const { User } = require('../model')
const { sign } = require('../util/jwt')

const signUp = async (req, res, next) => {
    const user = new User(req.body)

    try {
        user.role = 0;

        await user.save();

        const { _id, name, email, role, history, createdAt, updatedAt } = user;

        const userInfo = {
            _id,
            name,
            email,
            role,
            history,
            createdAt,
            updatedAt
        }

        res.status(201).json({
            code: 0,
            data: userInfo,
        })
    } catch (error) {
        next(error);
    }
}

const signIn = async (req, res, next) => {
    const user = req.user;

    const jwtSecret = process.env.JWT_SECRET;

    const token = await sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: '1d' },
    )

    const { _id, name, email, role, history, createdAt, updatedAt } = user;

    const userInfo = {
        _id,
        name,
        email,
        role,
        history,
        createdAt,
        updatedAt
    }

    // 将令牌写入 Cookie
    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({
        code: 0,
        data: {
            ...userInfo,
            token,
        },
    })
}

const signOut = (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({
        code: 0,
        msg: '退出成功'
    })
}


module.exports = {
    signUp,
    signIn,
    signOut,
}