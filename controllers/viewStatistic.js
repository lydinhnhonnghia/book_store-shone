const BaseController = require('./base');
const viewStatisticService = require('../services/viewStatistic');

class StoryController extends BaseController {
    constructor() {
        super();
    }

    async listActive(req, res) {
        try {
            const result = await viewStatisticService.listActive(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'view-statistic');
        }
    }
}
module.exports = new StoryController();
