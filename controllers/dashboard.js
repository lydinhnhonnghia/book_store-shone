const BaseController = require('./base');

class DashboardController extends BaseController {
    constructor() {
        super();
    }

    async view(req, res) {
        try {
            return super.renderPageAdmin(req, res, { path: 'dashboard/index' });
        } catch (error) {
            return super.resJsonError(res, error, 'dashboard');
        }
    }
}
module.exports = new DashboardController();
