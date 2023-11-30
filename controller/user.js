const { User } = require('../model')

const read = async (req, res, next) => {
    try {
        const user = req.profile;

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

        res.status(200).json({
            code: 0,
            data: userInfo,
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const user = req.profile;

        if(!name) {
            return res.status(400).json({
                code: -1,
                msg: '请传入昵称'
            })
        }

        if(!password || password.length < 6) {
            return res.status(400).json({
                code: -1,
                msg: '密码最少6位'
            })
        }

        user.name = name;
        user.password = password;

        await user.save();

        const { _id, email, role, history, createdAt, updatedAt } = user;

        const userInfo = {
            _id,
            name: user.name,
            email,
            role,
            history,
            createdAt,
            updatedAt
        }

        res.status(200).json({
            code: 0,
            data: userInfo,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    read,
    update,
}