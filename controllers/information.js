const BaseController = require('./base');
const informationService = require('../services/information');

class InformationController extends BaseController {
    constructor() {
        super();
    }

    async view(req, res) {
        try {
            return super.renderPageAdmin(req, res, { path: 'information/index' });
        } catch (error) {
            return super.resJsonError(res, error, 'information');
        }
    }

    async create(req, res) {
        try {
            const result = await informationService.create(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'information');
        }
    }

    async list(req, res) {
        try {
            const result = await informationService.list(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'information');
        }
    }

    async update(req, res) {
        try {
            const result = await informationService.updateOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'information');
        }
    }

    async getInfo(req, res) {
        try {
            const result = await informationService.getInfo(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'information');
        }
    }
}
module.exports = new InformationController();
