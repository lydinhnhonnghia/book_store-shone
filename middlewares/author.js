const {
    createValidator,
    updateValidator,
    authorOIdValidator,
} = require('./validators/author');

const { responseError } = require('../utils/shared');
const { checkBodyValidator } = require('./validators/_utils');
const {  checkQueryValidator } = require('./validators/_utils');

class ValidatorMiddleware {
    createMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, createValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    updateMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, updateValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    checkOIdMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, authorOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    checkQueOIdMiddleware(req, res, next) {
        const errorValidator = checkQueryValidator(req, authorOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }
    
}

const ins = new ValidatorMiddleware();
module.exports = ins;
