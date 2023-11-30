const { body } = require('express-validator')
const { User } = require('../model')
const { validate } = require('../middleware/validate')

const signUp = validate([
    body('name').notEmpty().withMessage('请填写昵称'),
    body('email')
        .notEmpty().withMessage('请填写邮件地址')
        .isEmail().withMessage('邮箱格式不正确')
        .bail()
        .custom(async email => {
            const user = await User.findOne({ email })
            if(user) {
                return Promise.reject(new Error('邮箱已存在'));
            }
        }),
    body('password').notEmpty().withMessage('密码不能为空'),
])

const signIn = [
    validate([
        body('email')
            .notEmpty().withMessage('请填写邮件地址')
            .isEmail().withMessage('邮箱格式不正确'),
        body('password').notEmpty().withMessage('密码不能为空'),
    ]),
    validate([
        body('email').custom(async (email, { req }) => {
            const user = await User.findOne({ email });
            if(!user) {
                return Promise.reject(new Error('用户不存在'));
            }

            req.user = user;
        })
    ]),
    validate([
        body('password').custom(async (password, { req }) => {
            const user = req.user;

            if(!user.authenticate(password)) {
                return Promise.reject(new Error('邮箱和密码不匹配'));
            }
        })
    ])
]

module.exports = {
    signUp,
    signIn,
}