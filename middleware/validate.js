const { validationResult, buildCheckFunction } = require('express-validator')
const { isValidObjectId: checkValidObjectId } = require('mongoose')

const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const firstError = errors.array()[0];

        const customError = {
            type: firstError.type,
            value: firstError.value,
            msg: firstError.msg,
            path: firstError.param,
            location: firstError.location,
        };

        res.status(400).json({
            code: -1,
            errors: customError
        });
    }
}

const isValidObjectId = (location, fields) => {
    return buildCheckFunction(location)(fields).custom(async value => {
        if (!checkValidObjectId(value)) {
            return Promise.reject(new Error('ID 不是一个有效的 objectID'));
        }
    });
};

module.exports = {
    validate,
    isValidObjectId,
}