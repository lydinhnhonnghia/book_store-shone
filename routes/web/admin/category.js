const categoryCtl = require('../../../controllers/category');
const validator = require('../../../middlewares/category');

module.exports = (router) => {
    router.get('/admin/category', categoryCtl.view);
    router.get('/admin/category/list', categoryCtl.list);
    router.get('/admin/category/info', validator.checkQueOIdMiddleware, categoryCtl.getInfo);
    router.get('/admin/category/list-active', categoryCtl.listActive);
    router.post('/admin/category/create', validator.createMiddleware, categoryCtl.create);
    router.post('/admin/category/update', validator.updateMiddleware, categoryCtl.update);
    router.post('/admin/category/delete', validator.checkOIdMiddleware, categoryCtl.delete);
};
