const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const sign = promisify(jwt.sign);

const verify = promisify(jwt.verify);

const decode = promisify(jwt.decode);

module.exports = {
    sign,
    verify,
    decode
}