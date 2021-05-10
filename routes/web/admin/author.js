const authorCtl = require('../../../controllers/author');
const validator = require('../../../middlewares/author');

module.exports = (router) => {
    router.get('/admin/author', authorCtl.view);
    router.get('/admin/author/list', authorCtl.list);
    router.get('/admin/author/list-active', authorCtl.listActive);
    router.post('/admin/author/create', validator.createMiddleware, authorCtl.create);
    router.post('/admin/author/update', validator.updateMiddleware, authorCtl.update);
    router.get('/admin/author/info', validator.checkQueOIdMiddleware, authorCtl.getInfo);
    router.post('/admin/author/delete', validator.checkOIdMiddleware, authorCtl.delete);
};
