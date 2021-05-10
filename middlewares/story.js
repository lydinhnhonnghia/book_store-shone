const {
    createValidator,
    updateValidator,
    storyOIdValidator,
    createChapterValidator,
    updateChapterValidator,
    chapterOIdValidator,
    updateStatusValidator,
} = require('./validators/story');

const { responseError, isEmpty, deleteFile } = require('../utils/shared');
const { checkBodyValidator, checkQueryValidator } = require('./validators/_utils');

class ValidatorMiddleware {
    createMiddleware(req, res, next) {
        if (!isEmpty(req.file)) {
            req.body.fullProfileImageUrl = req.file.path;
            req.body.profileImage = req.file.path;
        } else {
            delete req.body.profileImage;
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
            req.body.fullProfileImageUrl = req.file.path;
        }
        const errorValidator = checkBodyValidator(req, updateValidator);
        if (errorValidator) {
            if (req.file.path) deleteFile(req.file.path);
            return res.json(responseError(1001, errorValidator));
        }
        return next();
    }

    checkOIdMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, storyOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    updateStatusMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, updateStatusValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    checkQueStoryOIdMiddleware(req, res, next) {
        const errorValidator = checkQueryValidator(req, storyOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    createChapterMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, createChapterValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    updateChapterMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, updateChapterValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    checkChapteOIdMiddleware(req, res, next) {
        const errorValidator = checkBodyValidator(req, chapterOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }

    checkQueChapteOIdMiddleware(req, res, next) {
        const errorValidator = checkQueryValidator(req, chapterOIdValidator);
        if (errorValidator) return res.json(responseError(1001, errorValidator));
        return next();
    }
}

const ins = new ValidatorMiddleware();
module.exports = ins;
