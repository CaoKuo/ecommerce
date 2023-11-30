const { validate, isValidObjectId } = require('../middleware/validate')

const read = validate([
    isValidObjectId(['params'], 'userId')
])

const update = validate([
    isValidObjectId(['params'], 'userId')
])

module.exports = {
    read,
    update,
}