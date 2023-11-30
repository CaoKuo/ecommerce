const { validate, isValidObjectId } = require('../middleware/validate')

const create = validate([
    isValidObjectId(['params'], 'userId')
])

const read = validate([
    isValidObjectId(['params'], 'productId')
])

const update = [
    validate([
        isValidObjectId(['params'], 'productId')
    ]),
    validate([
        isValidObjectId(['params'], 'userId')
    ])
]

const remove = [
    validate([
        isValidObjectId(['params'], 'productId')
    ]),
    validate([
        isValidObjectId(['params'], 'userId')
    ])
]

const listRelated =  validate([
    isValidObjectId(['params'], 'productId')
])

module.exports = {
    create,
    read,
    update,
    remove,
    listRelated,
}