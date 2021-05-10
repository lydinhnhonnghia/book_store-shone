const BaseController = require('./base');

class DashboardController extends BaseController {
    constructor() {
        super();
    }

    async view(req, res) {
        try {
            return (await super.renderPageUser(req, res, { path: 'home/index' }));
        } catch (error) {
            return super.resJsonError(res, error, 'home');
        }
    }
}
module.exports = new DashboardController();
