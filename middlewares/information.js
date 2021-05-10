const {
    createValidator,
    updateValidator,
    informationOIdValidator,
} = require('./validators/information');

const { responseError, isEmpty, deleteFile } = require('../utils/shared');
const { checkBodyValidator } = require('./validators/_utils');

class ValidatorMiddleware {
    createMiddleware(req, res, next) {
        if (!isEmpty(req.file)) {
            req.body.fullLogoUrl = req.file.path;
            req.body.logo = req.file.path;
        } else {
            delete req.body.logo;
        }
        const errorValidator = checkBodyValidator(req, createValidator);
        if (errorValidator) {
            if (req.file.path) deleteFile(req.file.path);
            return res.json(responseError(1001, errorValidator));
        }
        return next();
    }

    updateMiddleware(req, res, next) {
        if (!isEmpty(req.file)) {
            req.body.fullLogoUrl = req.file.path;
        }
        const errorValidator = checkBodyValidator(req, updateValidator);
        if (errorValidator) {
            if (req.file.path) deleteFile(req.file.path);
            return res.json(responseError(1001, errorValidator));
        }
        return next();
    }

    checkOIdMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, informationOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }
}

const ins = new ValidatorMiddleware();
module.exports = ins;
