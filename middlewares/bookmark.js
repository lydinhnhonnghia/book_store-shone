const {
    createValidator,
} = require('./validators/bookmark');

const { responseError } = require('../utils/shared');
const { checkBodyValidator } = require('./validators/_utils');

class ValidatorMiddleware {
    createMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, createValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }
}

const ins = new ValidatorMiddleware();
module.exports = ins;
