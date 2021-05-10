const BaseController = require('./base');
const authorService = require('../services/author');

class AuthorController extends BaseController {
    constructor() {
        super();
    }

    async view(req, res) {
        try {
            return super.renderPageAdmin(req, res, { path: 'author/index' });
        } catch (error) {
            return super.resJsonError(res, error, 'author');
        }
    }

    async create(req, res) {
        try {
            const result = await authorService.create(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'author');
        }
    }

    async list(req, res) {
        try {
            const result = await authorService.list(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'author');
        }
    }

    async listActive(req, res) {
        try {
            const result = await authorService.listActive(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'author');
        }
    }

    async update(req, res) {
        try {
            const result = await authorService.updateOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'author');
        }
    }

    async getInfo(req, res) {
        try {
            const result = await authorService.getInfo(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'author');
        }
    }

    async delete(req, res) {
        try {
            const result = await authorService.deleteOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'author   ');
        }
    }
        

}
module.exports = new AuthorController();
