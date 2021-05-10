const dashboardCtl = require('../../../controllers/dashboard');

module.exports = (router) => {
    router.get('/admin/dashboard', dashboardCtl.view);
};
