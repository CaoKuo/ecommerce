const { body } = require('express-validator')
const { validate, isValidObjectId } = require('../middleware/validate')

const creat = validate([
    isValidObjectId(['params'], 'userId')
])

const read = validate([
    isValidObjectId(['params'], 'categoryId')
])

const update = [
    validate([  
        body('name').notEmpty().withMessage('标签名不能为空'),
    ]),
    validate([
        isValidObjectId(['params'], 'userId')
    ]),
    validate([
        isValidObjectId(['params'], 'categoryId')
    ])
]

const remove = [
    validate([
        isValidObjectId(['params'], 'categoryId')
    ]),
    validate([
        isValidObjectId(['params'], 'userId')
    ])
]

module.exports = {
    creat,
    read,
    update,
    remove,
}